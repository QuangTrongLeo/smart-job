package be_smart_job.service.ai.impl;

import be_smart_job.config.GeminiConfig;
import be_smart_job.dto.req.ai.ChatbotReq;
import be_smart_job.dto.res.ai.ChatbotResponse;
import be_smart_job.dto.res.job.JobResponse;
import be_smart_job.entity.Job;
import be_smart_job.enums.JobStatus;
import be_smart_job.mapper.job.JobMapper;
import be_smart_job.repository.job.JobRepository;
import be_smart_job.service.ai.interfaces.ChatBotService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.tika.Tika;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatBotServiceImpl implements ChatBotService {

    private final JobRepository jobRepository;
    private final JobMapper jobMapper;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final Tika tika;
    private final GeminiConfig geminiConfig;

    @Override
    public ChatbotResponse chatAndRecommendJobs(ChatbotReq request) {
        String cvContent = extractTextFromFile(request.getFile());

        // 1. Thử lấy danh sách Job đang OPEN
        List<Job> activeJobs = jobRepository.findByStatus(JobStatus.OPEN);

        // Nếu không có Job OPEN nào, lấy toàn bộ Job trong DB để làm dữ liệu mẫu
        if (activeJobs.isEmpty()) {
            activeJobs = jobRepository.findAll();
        }

        // Trường hợp DB thực sự không có bất kỳ Record nào
        if (activeJobs.isEmpty()) {
            return ChatbotResponse.builder()
                    .text("Cơ sở dữ liệu hiện tại chưa có bài tuyển dụng nào. Dưới đây là phân tích chi tiết CV của bạn.")
                    .recommendedJobs(Collections.emptyList())
                    .build();
        }

        StringBuilder jobsPrompt = new StringBuilder();
        for (Job job : activeJobs) {
            jobsPrompt.append(String.format(
                    "- ID: %s | Title: %s | Company: %s | ExperienceLevel: %s | Skills: %s | Description: %s\n",
                    job.getId(), job.getTitle(), job.getCompanyName(),
                    job.getExperienceLevel(), job.getRequiredSkills(), job.getDescription()
            ));
        }

        String systemPrompt = """
            Bạn là một chuyên gia tư vấn tuyển dụng AI.
            Nhiệm vụ của bạn:
            1. Phân tích chi tiết CV của ứng viên (Điểm mạnh, Điểm cần cải thiện, Định hướng phát triển).
            2. Chọn ra danh sách Job ID phù hợp nhất từ danh sách bên dưới.

            QUY TẮC:
            - Chọn từ 1 đến 3 Job ID phù hợp nhất.
            
            Yêu cầu trả về BẮT BUỘC theo đúng định dạng JSON thuần (không bọc trong markdown):
            {
              "text": "Câu trả lời phân tích chi tiết CV và tư vấn cho ứng viên",
              "matchedJobIds": ["ID_1", "ID_2"]
            }
            """;

        String userPrompt = String.format(
                "Yêu cầu người dùng: %s\n\nNội dung CV:\n%s\n\nDanh sách công việc đang tuyển:\n%s",
                request.getMessage(),
                cvContent.isEmpty() ? "Không cung cấp CV" : cvContent,
                jobsPrompt.toString()
        );

        return callGeminiApi(systemPrompt, userPrompt, activeJobs);
    }

    private String extractTextFromFile(MultipartFile file) {
        if (file == null || file.isEmpty()) return "";
        try (InputStream inputStream = file.getInputStream()) {
            return tika.parseToString(inputStream);
        } catch (Exception e) {
            log.error("Lỗi trích xuất file CV: {}", e.getMessage());
            return "";
        }
    }

    private ChatbotResponse callGeminiApi(String systemPrompt, String userPrompt, List<Job> activeJobs) {
        String mainModel = geminiConfig.getGeminiModel();
        try {
            return executeGeminiCall(mainModel, systemPrompt, userPrompt, activeJobs);
        } catch (HttpStatusCodeException e) {
            if ((e.getStatusCode().is5xxServerError() || e.getStatusCode().value() == 429)
                    && !"gemini-3.6-flash".equals(mainModel)) {

                log.warn("Model {} gặp sự cố, chuyển sang model dự phòng gemini-3.6-flash...", mainModel);
                try {
                    return executeGeminiCall("gemini-3.6-flash", systemPrompt, userPrompt, activeJobs);
                } catch (Exception ex) {
                    log.error("Lỗi khi gọi model dự phòng Gemini: ", ex);
                }
            }
            log.error("Lỗi HTTP từ Google Gemini API [{}]: {}", e.getStatusCode(), e.getResponseBodyAsString());
        } catch (Exception e) {
            log.error("Lỗi không xác định khi gọi API Gemini: ", e);
        }

        return ChatbotResponse.builder()
                .text("Hệ thống AI hiện tại đang quá tải. Vui lòng thử lại sau ít phút.")
                .recommendedJobs(Collections.emptyList())
                .build();
    }

    private ChatbotResponse executeGeminiCall(String targetModel, String systemPrompt, String userPrompt, List<Job> activeJobs) throws Exception {
        String cleanKey = geminiConfig.getApiKey() != null ? geminiConfig.getApiKey().trim() : "";
        String url = "https://generativelanguage.googleapis.com/v1beta/interactions";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("x-goog-api-key", cleanKey);
        headers.set("Api-Revision", "2026-05-20");

        Map<String, Object> body = Map.of(
                "model", targetModel,
                "input", systemPrompt + "\n\n" + userPrompt
        );

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
        JsonNode root = objectMapper.readTree(response.getBody());

        String aiJsonText = "";
        JsonNode steps = root.path("steps");
        if (steps.isArray()) {
            for (JsonNode step : steps) {
                if ("model_output".equals(step.path("type").asText())) {
                    JsonNode contentList = step.path("content");
                    if (contentList.isArray()) {
                        for (JsonNode item : contentList) {
                            if ("text".equals(item.path("type").asText())) {
                                aiJsonText = item.path("text").asText();
                                break;
                            }
                        }
                    }
                }
            }
        }

        String cleanedJsonText = cleanJsonContent(aiJsonText);
        JsonNode aiResult = objectMapper.readTree(cleanedJsonText);

        String responseText = aiResult.path("text").asText();

        List<String> matchedIds = new ArrayList<>();
        if (aiResult.has("matchedJobIds")) {
            aiResult.path("matchedJobIds").forEach(id -> matchedIds.add(id.asText()));
        }

        // Lọc danh sách JobResponse trùng khớp
        List<JobResponse> recommendedJobs = activeJobs.stream()
                .filter(job -> matchedIds.contains(job.getId()))
                .map(jobMapper::toResponse)
                .toList();

        // NẾU KHÔNG MATCH ĐƯỢC JOB NÀO: Chọn ngẫu nhiên (Random) 1 Job từ DB để trả về cho client
        if (recommendedJobs.isEmpty() && !activeJobs.isEmpty()) {
            List<Job> randomList = new ArrayList<>(activeJobs);
            Collections.shuffle(randomList);
            recommendedJobs = List.of(jobMapper.toResponse(randomList.get(0)));
        }

        return ChatbotResponse.builder()
                .text(responseText)
                .recommendedJobs(recommendedJobs)
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