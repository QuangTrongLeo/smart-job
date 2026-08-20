package be_smart_job.service.ai.impl;

import be_smart_job.config.GeminiConfig;
import be_smart_job.dto.req.ai.JobParseReq;
import be_smart_job.dto.res.ai.JobParseResponse;
import be_smart_job.enums.EmploymentType;
import be_smart_job.enums.ExperienceLevel;
import be_smart_job.service.ai.interfaces.JobParsingService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class JobParsingServiceImpl implements JobParsingService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final GeminiConfig geminiConfig;

    @Override
    public JobParseResponse parseJobDescription(JobParseReq request) {
        String systemPrompt = """
            Bạn là một chuyên gia Tuyển dụng và Trích xuất Dữ liệu Kỹ thuật (HR & Tech Recruiter Specialist).
            Nhiệm vụ của bạn là phân tích văn bản tiêu đề và mô tả công việc (Job Description) thô do người dùng cung cấp.
            
            Hãy xử lý và trích xuất các thông tin sau:
            1. Trích xuất danh sách các kỹ năng, công nghệ, framework, cơ sở dữ liệu, công cụ cần thiết (requiredSkills) (Tối đa 10 kỹ năng ngắn gọn, ví dụ: ["Java", "Spring Boot", "MySQL", "Docker", "JWT", "REST API", "AWS", "Redis"]).
            2. Viết lại một bản tóm tắt mô tả công việc chuyên nghiệp, rõ ràng, sửa lỗi chính tả và loại bỏ các đoạn văn rườm rà (aiParsedDesc).
            3. Phân tích và dự đoán ExperienceLevel (Chỉ chọn 1 trong các giá trị Enum sau: NO_EXPERIENCE, INTERN_FRESHER, JUNIOR, MIDDLE, SENIOR, EXPERT).
            4. Phân tích và dự đoán số năm kinh nghiệm tối thiểu requiredExperienceYears (Là một số nguyên dương, ví dụ: 2).
            5. Phân tích và dự đoán EmploymentType (Chỉ chọn 1 trong các giá trị Enum sau: FULL_TIME, PART_TIME, FREELANCE, REMOTE, HYBRID).

            YÊU CẦU ĐỊNH DẠNG TRẢ VỀ (BẮT BUỘC TRẢ VỀ JSON CHUẨN):
            {
              "aiParsedDesc": "Mô tả công việc đã chuẩn hóa...",
              "requiredSkills": ["Java", "Spring Boot", "MySQL", "Docker", "JWT", "REST API", "AWS", "Redis"],
              "experienceLevel": "MIDDLE",
              "requiredExperienceYears": 2,
              "employmentType": "FULL_TIME"
            }
            """;

        String userPrompt = String.format(
                "Tiêu đề công việc: %s\n\nMô tả công việc thô:\n%s",
                request.getTitle() != null ? request.getTitle() : "Không có tiêu đề",
                request.getDescription()
        );

        return callGeminiApiForParsing(systemPrompt, userPrompt);
    }

    private JobParseResponse callGeminiApiForParsing(String systemPrompt, String userPrompt) {
        String mainModel = geminiConfig.getGeminiModel();
        if (mainModel == null || mainModel.isBlank()) {
            mainModel = "gemini-1.5-flash";
        }

        try {
            return executeGeminiCall(mainModel, systemPrompt, userPrompt);
        } catch (HttpStatusCodeException e) {
            log.error("Lỗi HTTP từ Google Gemini API [{}]: {}", e.getStatusCode(), e.getResponseBodyAsString());
            if ((e.getStatusCode().is5xxServerError() || e.getStatusCode().value() == 429)
                    && !"gemini-1.5-flash".equals(mainModel)) {
                log.warn("Model {} gặp sự cố, chuyển sang model dự phòng gemini-1.5-flash...", mainModel);
                try {
                    return executeGeminiCall("gemini-1.5-flash", systemPrompt, userPrompt);
                } catch (Exception ex) {
                    log.error("Lỗi khi gọi model dự phòng Gemini: ", ex);
                }
            }
        } catch (Exception e) {
            log.error("Lỗi không xác định khi gọi API Gemini Job Parsing: ", e);
        }

        // Fallback trả về dữ liệu an toàn nếu AI gặp sự cố
        return JobParseResponse.builder()
                .aiParsedDesc(userPrompt)
                .requiredSkills(Collections.emptyList())
                .experienceLevel(ExperienceLevel.JUNIOR)
                .requiredExperienceYears(1)
                .employmentType(EmploymentType.FULL_TIME)
                .build();
    }

    private JobParseResponse executeGeminiCall(String targetModel, String systemPrompt, String userPrompt) throws Exception {
        String cleanKey = geminiConfig.getApiKey() != null ? geminiConfig.getApiKey().trim() : "";

        // Cấu hình chuẩn Endpoint URL Gemini API generateContent
        String url = String.format("https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s",
                targetModel, cleanKey);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Chuẩn hóa Request Body theo Gemini API
        Map<String, Object> textPart = Map.of("text", systemPrompt + "\n\n" + userPrompt);
        Map<String, Object> contentsObj = Map.of("parts", List.of(textPart));

        // Yêu cầu Gemini trả về định dạng JSON
        Map<String, Object> generationConfig = Map.of("responseMimeType", "application/json");

        Map<String, Object> body = Map.of(
                "contents", List.of(contentsObj),
                "generationConfig", generationConfig
        );

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
        JsonNode root = objectMapper.readTree(response.getBody());

        // Bóc tách JSON response từ Gemini API: candidates[0].content.parts[0].text
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

        // Bóc tách danh sách Skills
        List<String> skills = new ArrayList<>();
        if (aiResult.has("requiredSkills") && aiResult.get("requiredSkills").isArray()) {
            aiResult.path("requiredSkills").forEach(s -> skills.add(s.asText()));
        }

        // Mapping Enum Cấp độ Kinh nghiệm
        ExperienceLevel expLevel = ExperienceLevel.JUNIOR;
        try {
            if (aiResult.has("experienceLevel")) {
                expLevel = ExperienceLevel.valueOf(aiResult.path("experienceLevel").asText().toUpperCase());
            }
        } catch (Exception ignored) {}

        // Mapping Enum Hình thức làm việc
        EmploymentType empType = EmploymentType.FULL_TIME;
        try {
            if (aiResult.has("employmentType")) {
                empType = EmploymentType.valueOf(aiResult.path("employmentType").asText().toUpperCase());
            }
        } catch (Exception ignored) {}

        int expYears = aiResult.path("requiredExperienceYears").asInt(1);
        String aiParsedDesc = aiResult.path("aiParsedDesc").asText(userPrompt);

        return JobParseResponse.builder()
                .aiParsedDesc(aiParsedDesc)
                .requiredSkills(skills)
                .experienceLevel(expLevel)
                .requiredExperienceYears(expYears)
                .employmentType(empType)
                .build();
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