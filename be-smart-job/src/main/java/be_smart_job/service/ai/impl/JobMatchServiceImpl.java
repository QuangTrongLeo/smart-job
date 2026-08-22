package be_smart_job.service.ai.impl;

import be_smart_job.config.GeminiConfig;
import be_smart_job.dto.req.ai.JobMatchReq;
import be_smart_job.dto.res.ai.AiMatchResultResponse;
import be_smart_job.dto.res.ai.JobMatchResponse;
import be_smart_job.entity.FreelancerProfile;
import be_smart_job.entity.Job;
import be_smart_job.entity.JobMatch;
import be_smart_job.entity.User;
import be_smart_job.enums.MatchStatus;
import be_smart_job.mapper.ai.AiJobMatchMapper;
import be_smart_job.repository.job.JobMatchRepository;
import be_smart_job.repository.identity.UserRepository;
import be_smart_job.repository.job.FreelancerProfileRepository;
import be_smart_job.repository.job.JobRepository;
import be_smart_job.service.ai.interfaces.JobMatchService;
import be_smart_job.util.SecurityUtils;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Slf4j
@Service("aiJobMatchServiceImpl")
@RequiredArgsConstructor
public class JobMatchServiceImpl implements JobMatchService {

    private final JobRepository jobRepository;
    private final FreelancerProfileRepository freelancerProfileRepository;
    private final UserRepository userRepository;
    private final JobMatchRepository jobMatchRepository;
    private final AiJobMatchMapper aiJobMatchMapper;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final GeminiConfig geminiConfig;

    @Override
    public JobMatchResponse matchFreelancerToJob(JobMatchReq request) {
        // Gọi tới phương thức overload bên dưới
        return matchFreelancerToJob(request.getJobId(), request.getFreelancerId());
    }

    @Override
    public JobMatchResponse matchFreelancerToJob(String jobId, String freelancerId) {
        // 1. Xác định identifier của người dùng (nếu tham số freelancerId trống thì lấy từ Security Context)
        String currentPrincipal = (freelancerId != null && !freelancerId.isBlank())
                ? freelancerId
                : SecurityUtils.getCurrentUserId();

        // 2. Tìm User Entity từ database (hỗ trợ ID, Username, Email)
        User currentUser = userRepository.findById(currentPrincipal)
                .orElseGet(() -> userRepository.findByUsername(currentPrincipal)
                        .orElseGet(() -> userRepository.findByEmail(currentPrincipal)
                                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy thông tin tài khoản người dùng với ID/Email: " + currentPrincipal))));

        // 3. Tìm FreelancerProfile theo User ID, Email hoặc Profile ID
        FreelancerProfile profile = freelancerProfileRepository.findByUserId(currentUser.getId())
                .orElseGet(() -> freelancerProfileRepository.findByUserId(currentUser.getEmail())
                        .orElseGet(() -> freelancerProfileRepository.findById(currentUser.getId())
                                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy hồ sơ Freelancer tương ứng với tài khoản người dùng"))));

        // 4. Tìm thông tin Job
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy công việc với ID: " + jobId));

        // 5. Gọi Gemini AI xử lý match
        AiMatchResultResponse aiAnalysis = evaluateMatchWithGemini(job, profile);

        // 6. Lưu kết quả Match vào DB
        JobMatch jobMatch = jobMatchRepository.findByJobIdAndFreelancerId(job.getId(), currentUser.getId())
                .orElseGet(() -> JobMatch.builder()
                        .jobId(job.getId())
                        .freelancerId(currentUser.getId())
                        .status(MatchStatus.SUGGESTED)
                        .build());

        jobMatch.setMatchScore(aiAnalysis.getMatchScore());
        jobMatch.setMatchingSkills(aiAnalysis.getMatchingSkills());
        jobMatch.setMissingSkills(aiAnalysis.getMissingSkills());
        jobMatch.setExplanation(aiAnalysis.getExplanation());

        JobMatch savedJobMatch = jobMatchRepository.save(jobMatch);
        return aiJobMatchMapper.toResponse(savedJobMatch);
    }

    private AiMatchResultResponse evaluateMatchWithGemini(Job job, FreelancerProfile profile) {
        String systemPrompt = """
            Bạn là một AI Chuyên gia Tuyển dụng (HR & Tech Matching Specialist).
            Nhiệm vụ của bạn là so sánh thông tin chi tiết của một Công việc (Job) và một Lập trình viên/Freelancer để đưa ra điểm số phù hợp và lời giải thích minh bạch.

            YÊU CẦU TRẢ VỀ ĐỊNH DẠNG JSON DUY NHẤT VỚI CÁC TRƯỜNG SAU:
            1. matchScore: Điểm số phù hợp từ 0.0 đến 100.0 (số thực).
            2. matchingSkills: Danh sách mảng các kỹ năng Freelancer ĐÃ CÓ và KHỚP với yêu cầu công việc.
            3. missingSkills: Danh sách mảng các kỹ năng Công việc YÊU CẦU nhưng Freelancer CÒN THIẾU.
            4. explanation: Đoạn văn ngắn (2-4 câu bằng Tiếng Việt) giải thích rõ ràng lý do tại sao đưa ra mức điểm này.
            """;

        String userContent = String.format("""
            --- CÔNG VIỆC (JOB) ---
            Tiêu đề: %s
            Mô tả: %s
            Yêu cầu kinh nghiệm: %s (%d năm)
            Kỹ năng yêu cầu: %s

            --- HỒ SƠ FREELANCER ---
            Chuyên môn: %s
            Số năm kinh nghiệm: %d năm
            Giới thiệu: %s
            Kỹ năng hiện có: %s
            """,
                job.getTitle() != null ? job.getTitle() : "",
                job.getDescription() != null ? job.getDescription() : "",
                job.getExperienceLevel() != null ? job.getExperienceLevel().name() : "Không yêu cầu",
                job.getRequiredExperienceYears() != null ? job.getRequiredExperienceYears() : 0,
                job.getRequiredSkills() != null ? String.join(", ", job.getRequiredSkills()) : "Không có",
                profile.getTitle() != null ? profile.getTitle() : "",
                profile.getYearsOfExperience() != null ? profile.getYearsOfExperience() : 0,
                profile.getBio() != null ? profile.getBio() : "",
                profile.getSkills() != null ? String.join(", ", profile.getSkills()) : "Không có"
        );

        String targetModel = geminiConfig.getGeminiModel() != null ? geminiConfig.getGeminiModel() : "gemini-1.5-flash";

        try {
            String cleanKey = geminiConfig.getApiKey() != null ? geminiConfig.getApiKey().trim() : "";
            String url = String.format("https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s", targetModel, cleanKey);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> textPart = Map.of("text", systemPrompt + "\n\n" + userContent);
            Map<String, Object> contentsObj = Map.of("parts", List.of(textPart));
            Map<String, Object> generationConfig = Map.of("responseMimeType", "application/json");

            Map<String, Object> body = Map.of("contents", List.of(contentsObj), "generationConfig", generationConfig);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
            JsonNode root = objectMapper.readTree(response.getBody());

            String aiJsonText = root.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();
            JsonNode aiResult = objectMapper.readTree(cleanJsonContent(aiJsonText));

            List<String> matchingSkills = new ArrayList<>();
            if (aiResult.has("matchingSkills")) {
                aiResult.path("matchingSkills").forEach(s -> matchingSkills.add(s.asText()));
            }

            List<String> missingSkills = new ArrayList<>();
            if (aiResult.has("missingSkills")) {
                aiResult.path("missingSkills").forEach(s -> missingSkills.add(s.asText()));
            }

            return AiMatchResultResponse.builder()
                    .matchScore(aiResult.path("matchScore").asDouble(50.0))
                    .matchingSkills(matchingSkills)
                    .missingSkills(missingSkills)
                    .explanation(aiResult.path("explanation").asText("Không có giải thích chi tiết."))
                    .build();

        } catch (Exception e) {
            log.error("Lỗi khi ghép nối công việc qua Gemini API: ", e);
            return AiMatchResultResponse.builder()
                    .matchScore(0.0)
                    .matchingSkills(Collections.emptyList())
                    .missingSkills(job.getRequiredSkills() != null ? job.getRequiredSkills() : Collections.emptyList())
                    .explanation("Không thể phân tích dữ liệu ghép nối do lỗi hệ thống AI.")
                    .build();
        }
    }

    private String cleanJsonContent(String rawText) {
        if (rawText == null || rawText.isBlank()) return "{}";
        String cleaned = rawText.trim();
        if (cleaned.startsWith("```json")) cleaned = cleaned.substring(7);
        else if (cleaned.startsWith("```")) cleaned = cleaned.substring(3);
        if (cleaned.endsWith("```")) cleaned = cleaned.substring(0, cleaned.length() - 3);
        return cleaned.trim();
    }
}