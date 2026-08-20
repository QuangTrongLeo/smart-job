package be_smart_job.service.ai.impl;

import be_smart_job.dto.req.ai.ChatbotReq;
import be_smart_job.dto.res.ai.ChatbotResponse;
import be_smart_job.dto.res.job.JobResponse;
import be_smart_job.entity.Job;
import be_smart_job.enums.JobStatus;
import be_smart_job.mapper.job.JobMapper;
import be_smart_job.repository.job.JobRepository;
import be_smart_job.service.ai.interfaces.ChatbotAiService;
import be_smart_job.service.ai.interfaces.GeminiClientService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.tika.Tika;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatbotAiServiceImpl implements ChatbotAiService {

    private final GeminiClientService geminiClientService;
    private final JobRepository jobRepository;
    private final JobMapper jobMapper;
    private final ObjectMapper objectMapper;
    private final Tika tika = new Tika();

    @Override
    public ChatbotResponse suggestJobsFromCv(ChatbotReq request) {
        // 1. Bóc tách văn bản từ file CV (PDF/DOCX) nếu có
        String cvContent = extractContentFromCv(request.getFile());

        // 2. Lấy danh sách việc làm đang mở tuyển dụng (OPEN)
        List<Job> activeJobs = jobRepository.findByStatus(JobStatus.OPEN);

        // 3. Xây dựng ngữ cảnh các việc làm hiện có gửi cho AI
        StringBuilder jobsContext = new StringBuilder();
        if (activeJobs.isEmpty()) {
            jobsContext.append("Hiện tại không có công việc nào đang mở tuyển dụng.");
        } else {
            for (Job job : activeJobs) {
                jobsContext.append(String.format("""
                    - ID: %s
                      Tiêu đề: %s
                      Mô tả: %s
                      Kỹ năng yêu cầu: %s
                    """,
                        job.getId(),
                        job.getTitle(),
                        job.getAiParsedDesc() != null ? job.getAiParsedDesc() : job.getDescription(),
                        job.getRequiredSkills() != null ? String.join(", ", job.getRequiredSkills()) : "Không ghi rõ"
                ));
            }
        }

        // 4. Tạo Prompt phân tích cho Gemini AI
        String prompt = String.format("""
            Bạn là trợ lý tư vấn tuyển dụng thông minh cho nền tảng tìm việc SmartJob.
            
            [Yêu cầu từ người dùng]:
            "%s"
            
            [Nội dung CV/Hồ sơ người dùng cung cấp]:
            \"\"\"
            %s
            \"\"\"
            
            [Danh sách công việc hiện có trong hệ thống]:
            \"\"\"
            %s
            \"\"\"
            
            Nhiệm vụ của bạn:
            1. Đánh giá ngắn gọn năng lực chuyên môn dựa trên CV (nếu có) hoặc yêu cầu của người dùng.
            2. Lọc ra tối đa 3 công việc phù hợp nhất từ danh sách trên.
            3. Trả về kết quả hoàn toàn bằng định dạng JSON duy nhất theo đúng cấu trúc sau:
            {
              "reply": "Lời chào và đoạn phân tích ngắn về hồ sơ/yêu cầu ứng viên.",
              "recommendedJobs": [
                {
                  "jobId": "ID công việc lấy chính xác từ danh sách",
                  "matchScore": 85.0,
                  "reason": "Giải thích ngắn gọn lý do công việc này phù hợp với ứng viên"
                }
              ]
            }
            """,
                request.getMessage(),
                cvContent.isBlank() ? "Người dùng không đính kèm file CV." : cvContent,
                jobsContext
        );

        // 5. Gọi Gemini API và map dữ liệu về ChatbotResponse
        try {
            String jsonResult = geminiClientService.generateJsonContent(prompt);
            JsonNode rootNode = objectMapper.readTree(jsonResult);

            String reply = rootNode.has("reply")
                    ? rootNode.get("reply").asText()
                    : "Dưới đây là các công việc phù hợp với yêu cầu của bạn:";

            List<ChatbotResponse.RecommendedJobItem> recommendedJobItems = new ArrayList<>();

            if (rootNode.has("recommendedJobs") && rootNode.get("recommendedJobs").isArray()) {
                for (JsonNode itemNode : rootNode.get("recommendedJobs")) {
                    String jobId = itemNode.get("jobId").asText();
                    Double matchScore = itemNode.has("matchScore") ? itemNode.get("matchScore").asDouble() : 0.0;
                    String reason = itemNode.has("reason") ? itemNode.get("reason").asText() : "";

                    // Query Entity Job và chuyển sang JobResponse bằng JobMapper
                    Optional<Job> optionalJob = jobRepository.findById(jobId);
                    if (optionalJob.isPresent()) {
                        JobResponse jobResponse = jobMapper.toResponse(optionalJob.get());

                        recommendedJobItems.add(ChatbotResponse.RecommendedJobItem.builder()
                                .job(jobResponse)
                                .matchScore(matchScore)
                                .reason(reason)
                                .build());
                    }
                }
            }

            return ChatbotResponse.builder()
                    .reply(reply)
                    .recommendedJobs(recommendedJobItems)
                    .build();

        } catch (Exception e) {
            log.error("Lỗi khi xử lý tư vấn từ Gemini: {}", e.getMessage(), e);
            throw new RuntimeException("Lỗi trong quá trình AI phân tích và gợi ý việc làm.");
        }
    }

    private String extractContentFromCv(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return "";
        }
        try {
            return tika.parseToString(file.getInputStream());
        } catch (Exception e) {
            log.error("Lỗi khi đọc file CV: {}", e.getMessage());
            throw new RuntimeException("Không thể đọc định dạng file CV. Vui lòng thử lại với file PDF, DOCX hoặc TXT.");
        }
    }
}