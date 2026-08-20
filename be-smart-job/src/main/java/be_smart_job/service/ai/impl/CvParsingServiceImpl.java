package be_smart_job.service.ai.impl;

import be_smart_job.config.GeminiConfig;
import be_smart_job.dto.res.ai.CvParseResponse;
import be_smart_job.dto.res.job.WorkExperienceResponse;
import be_smart_job.service.ai.interfaces.CvParsingService;
import be_smart_job.util.CvExtractorUtil;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class CvParsingServiceImpl implements CvParsingService {

    private final CvExtractorUtil cvExtractorUtil;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final GeminiConfig geminiConfig;

    @Override
    public CvParseResponse parseCvFile(MultipartFile file) {
        String cvText = cvExtractorUtil.extractTextFromCv(file);
        return parseCvText(cvText);
    }

    @Override
    public CvParseResponse parseCvText(String rawCvText) {
        String systemPrompt = """
            Bạn là một AI Chuyên gia Tuyển dụng (HR & Tech Recruiter Specialist).
            Nhiệm vụ của bạn là phân tích toàn bộ văn bản CV của Ứng viên/Freelancer được cung cấp bên dưới.

            Hãy trích xuất và chuẩn hóa thông tin thành định dạng JSON với các trường sau:
            1. title: Chức danh công việc nổi bật (VD: "Senior Fullstack Developer", "Frontend React Engineer").
            2. bio: Tóm tắt ngắn gọn 2-4 câu giới thiệu bản thân và thế mạnh ứng viên.
            3. yearsOfExperience: Số năm kinh nghiệm làm việc (số nguyên, ví dụ: 3).
            4. skills: Danh sách mảng các kỹ năng chuyên môn, công nghệ, ngoại ngữ (Tối đa 15 kỹ năng, ví dụ: ["Java", "Spring Boot", "React", "Docker"]).
            5. languages: Danh sách ngoại ngữ (ví dụ: ["Tiếng Việt", "Tiếng Anh"]).
            6. experiences: Mảng lịch sử làm việc/dự án cũ. Mỗi phần tử bao gồm:
               - title: Vị trí làm việc
               - company: Tên công ty / Dự án
               - startDate: Ngày bắt đầu (định dạng MM/YYYY hoặc YYYY)
               - endDate: Ngày kết thúc (định dạng MM/YYYY hoặc "Hiện tại")
               - isCurrent: boolean (true nếu đang làm việc, false nếu đã nghỉ)
               - description: Tóm tắt trách nhiệm & thành tựu chính

            YÊU CẦU ĐỊNH DẠNG TRẢ VỀ (BẮT BUỘC TRẢ VỀ JSON CHUẨN TRONG MỘT ĐOẠN DUY NHẤT):
            {
              "title": "Senior Java Developer",
              "bio": "Lập trình viên Java với hơn 4 năm kinh nghiệm...",
              "yearsOfExperience": 4,
              "skills": ["Java", "Spring Boot", "MongoDB", "Docker"],
              "languages": ["Tiếng Việt", "Tiếng Anh"],
              "experiences": [
                {
                  "title": "Backend Developer",
                  "company": "Công ty ABC",
                  "startDate": "01/2022",
                  "endDate": "Hiện tại",
                  "isCurrent": true,
                  "description": "Phát triển RESTful API cho hệ thống E-commerce..."
                }
              ]
            }
            """;

        return callGeminiApiForCv(systemPrompt, rawCvText);
    }

    private CvParseResponse callGeminiApiForCv(String systemPrompt, String rawCvText) {
        String targetModel = geminiConfig.getGeminiModel();
        if (targetModel == null || targetModel.isBlank()) {
            targetModel = "gemini-1.5-flash";
        }

        try {
            String cleanKey = geminiConfig.getApiKey() != null ? geminiConfig.getApiKey().trim() : "";
            String url = String.format("https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s",
                    targetModel, cleanKey);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> textPart = Map.of("text", systemPrompt + "\n\nNỘI DUNG CV THÔ:\n" + rawCvText);
            Map<String, Object> contentsObj = Map.of("parts", List.of(textPart));
            Map<String, Object> generationConfig = Map.of("responseMimeType", "application/json");

            Map<String, Object> body = Map.of(
                    "contents", List.of(contentsObj),
                    "generationConfig", generationConfig
            );

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
            JsonNode root = objectMapper.readTree(response.getBody());

            String aiJsonText = "";
            JsonNode candidates = root.path("candidates");
            if (candidates.isArray() && !candidates.isEmpty()) {
                JsonNode parts = candidates.get(0).path("content").path("parts");
                if (parts.isArray() && !parts.isEmpty()) {
                    aiJsonText = parts.get(0).path("text").asText();
                }
            }

            String cleanedJsonText = cleanJsonContent(aiJsonText);
            JsonNode aiResult = objectMapper.readTree(cleanedJsonText);

            List<String> skills = new ArrayList<>();
            if (aiResult.has("skills") && aiResult.get("skills").isArray()) {
                aiResult.path("skills").forEach(s -> skills.add(s.asText()));
            }

            List<String> languages = new ArrayList<>();
            if (aiResult.has("languages") && aiResult.get("languages").isArray()) {
                aiResult.path("languages").forEach(l -> languages.add(l.asText()));
            }

            List<WorkExperienceResponse> experiences = new ArrayList<>();
            if (aiResult.has("experiences") && aiResult.get("experiences").isArray()) {
                experiences = objectMapper.convertValue(
                        aiResult.get("experiences"),
                        new TypeReference<List<WorkExperienceResponse>>() {}
                );
            }

            return CvParseResponse.builder()
                    .title(aiResult.path("title").asText("Freelancer"))
                    .bio(aiResult.path("bio").asText(""))
                    .yearsOfExperience(aiResult.path("yearsOfExperience").asInt(0))
                    .skills(skills)
                    .languages(languages)
                    .experiences(experiences)
                    .build();

        } catch (Exception e) {
            log.error("Lỗi khi phân tích CV qua Gemini API: ", e);
            return CvParseResponse.builder()
                    .title("Freelancer")
                    .bio(rawCvText)
                    .yearsOfExperience(0)
                    .skills(Collections.emptyList())
                    .languages(Collections.emptyList())
                    .experiences(Collections.emptyList())
                    .build();
        }
    }

    private String cleanJsonContent(String rawText) {
        if (rawText == null || rawText.isBlank()) return "{}";
        String cleaned = rawText.trim();
        if (cleaned.startsWith("```json")) {
            cleaned = cleaned.substring(7);
        } else if (cleaned.startsWith("```")) {
            cleaned = cleaned.substring(3);
        }
        if (cleaned.endsWith("```")) {
            cleaned = cleaned.substring(0, cleaned.length() - 3);
        }
        return cleaned.trim();
    }
}