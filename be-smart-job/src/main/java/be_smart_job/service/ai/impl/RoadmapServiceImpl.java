package be_smart_job.service.ai.impl;

import be_smart_job.config.GeminiConfig;
import be_smart_job.dto.req.ai.RoadmapReq;
import be_smart_job.dto.res.ai.AiRoadmapStep;
import be_smart_job.dto.res.ai.RoadmapResponse;
import be_smart_job.dto.res.ai.RoadmapStepResponse;
import be_smart_job.entity.Job;
import be_smart_job.entity.JobMatch;
import be_smart_job.entity.Roadmap;
import be_smart_job.entity.RoadmapStep;
import be_smart_job.entity.User;
import be_smart_job.mapper.ai.RoadmapMapper;
import be_smart_job.repository.job.JobMatchRepository;
import be_smart_job.repository.ai.RoadmapRepository;
import be_smart_job.repository.ai.RoadmapStepRepository;
import be_smart_job.repository.identity.UserRepository;
import be_smart_job.repository.job.JobRepository;
import be_smart_job.service.ai.interfaces.RoadmapService;
import be_smart_job.util.SecurityUtils;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class RoadmapServiceImpl implements RoadmapService {

    private final JobMatchRepository jobMatchRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final RoadmapRepository roadmapRepository;
    private final RoadmapStepRepository roadmapStepRepository;
    private final RoadmapMapper roadmapMapper;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final GeminiConfig geminiConfig;

    private static final double MIN_MATCH_SCORE_THRESHOLD = 80.0;
    private static final double TARGET_SCORE_GOAL = 85.0;

    @Override
    public RoadmapResponse generateRoadmap(RoadmapReq request) {
        return generateRoadmap(request.getMatchId());
    }

    @Override
    public RoadmapResponse generateRoadmap(String matchId) {
        // 1. Xác định thông tin Freelancer đang đăng nhập từ Security Context Token
        String currentPrincipal = SecurityUtils.getCurrentUserId();
        User currentUser = userRepository.findById(currentPrincipal)
                .orElseGet(() -> userRepository.findByUsername(currentPrincipal)
                        .orElseGet(() -> userRepository.findByEmail(currentPrincipal)
                                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người dùng hiện tại: " + currentPrincipal))));

        // 2. Tìm thông tin JobMatch từ DB
        JobMatch match = jobMatchRepository.findById(matchId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy dữ liệu ghép nối với ID: " + matchId));

        // Kiểm tra quyền truy cập (Freelancer hiện tại phải chính là người trong bản ghi Match)
        if (SecurityUtils.hasRole("FREELANCER") && !match.getFreelancerId().equals(currentUser.getId())) {
            throw new IllegalArgumentException("Bạn không có quyền truy cập hoặc tạo lộ trình cho kết quả ghép nối này");
        }

        // 3. Đánh giá điều kiện điểm số (Chỉ tạo roadmap khi matchScore < 80%)
        if (match.getMatchScore() != null && match.getMatchScore() >= MIN_MATCH_SCORE_THRESHOLD) {
            throw new IllegalArgumentException(
                    String.format("Điểm số phù hợp hiện tại đã đạt %.1f%% (>= 80%%). Freelancer không cần lộ trình cải thiện kỹ năng!", match.getMatchScore())
            );
        }

        if (match.getMissingSkills() == null || match.getMissingSkills().isEmpty()) {
            throw new IllegalArgumentException("Không tìm thấy kỹ năng thiếu sót (missingSkills) để xây dựng lộ trình học tập!");
        }

        // 4. Lấy thông tin Job
        Job job = jobRepository.findById(match.getJobId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy thông tin công việc liên quan ID: " + match.getJobId()));

        // 5. Nếu đã từng sinh Roadmap cho match này, xóa Roadmap & Steps cũ để tạo mới
        roadmapRepository.findByMatchId(matchId).ifPresent(oldRoadmap -> {
            roadmapStepRepository.deleteByRoadmapId(oldRoadmap.getId());
            roadmapRepository.delete(oldRoadmap);
        });

        // 6. Gọi Gemini AI sinh dữ liệu Roadmap
        List<AiRoadmapStep> aiSteps = evaluateRoadmapWithGemini(job, match);

        // 7. Lưu entity Roadmap
        Roadmap roadmap = Roadmap.builder()
                .matchId(match.getId())
                .freelancerId(match.getFreelancerId())
                .jobId(match.getJobId())
                .currentScore(match.getMatchScore())
                .targetScore(TARGET_SCORE_GOAL)
                .totalSteps(aiSteps.size())
                .completedSteps(0)
                .build();

        Roadmap savedRoadmap = roadmapRepository.save(roadmap);

        // 8. Lưu các entity RoadmapStep
        List<RoadmapStep> stepsToSave = aiSteps.stream().map(step -> RoadmapStep.builder()
                .roadmapId(savedRoadmap.getId())
                .stepNumber(step.getStepNumber())
                .missingSkill(step.getMissingSkill())
                .action(step.getAction())
                .resourceUrl(step.getResourceUrl())
                .estimatedHours(step.getEstimatedHours() != null ? step.getEstimatedHours() : 10)
                .isCompleted(false)
                .build()
        ).collect(Collectors.toList());

        List<RoadmapStep> savedSteps = roadmapStepRepository.saveAll(stepsToSave);

        return roadmapMapper.toResponse(savedRoadmap, savedSteps);
    }

    @Override
    public RoadmapResponse getRoadmapByMatchId(String matchId) {
        Roadmap roadmap = roadmapRepository.findByMatchId(matchId)
                .orElseThrow(() -> new IllegalArgumentException("Chưa có lộ trình phát triển kỹ năng nào cho ID ghép nối: " + matchId));

        List<RoadmapStep> steps = roadmapStepRepository.findByRoadmapIdOrderByStepNumberAsc(roadmap.getId());
        return roadmapMapper.toResponse(roadmap, steps);
    }

    @Override
    public RoadmapStepResponse toggleStepCompletion(String stepId, Boolean isCompleted) {
        RoadmapStep step = roadmapStepRepository.findById(stepId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy bước học tập với ID: " + stepId));

        step.setIsCompleted(isCompleted != null ? isCompleted : true);
        RoadmapStep savedStep = roadmapStepRepository.save(step);

        // Cập nhật tổng số bước completedSteps trong Roadmap cha
        roadmapRepository.findById(step.getRoadmapId()).ifPresent(roadmap -> {
            List<RoadmapStep> allSteps = roadmapStepRepository.findByRoadmapIdOrderByStepNumberAsc(roadmap.getId());
            long completedCount = allSteps.stream().filter(RoadmapStep::getIsCompleted).count();
            roadmap.setCompletedSteps((int) completedCount);
            roadmapRepository.save(roadmap);
        });

        return roadmapMapper.toStepResponse(savedStep);
    }

    @Override
    public List<RoadmapResponse> getMyRoadmaps() {
        // 1. Lấy ID của Freelancer đang đăng nhập từ Security Context Token
        String currentUserId = SecurityUtils.getCurrentUserId();
        User currentUser = userRepository.findById(currentUserId)
                .orElseGet(() -> userRepository.findByUsername(currentUserId)
                        .orElseGet(() -> userRepository.findByEmail(currentUserId)
                                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người dùng hiện tại: " + currentUserId))));

        // 2. Tìm tất cả các Roadmap thuộc về Freelancer này
        List<Roadmap> roadmaps = roadmapRepository.findByFreelancerId(currentUser.getId());

        // 3. Map từng Roadmap kèm danh sách RoadmapStep tương ứng
        return roadmaps.stream().map(roadmap -> {
            List<RoadmapStep> steps = roadmapStepRepository.findByRoadmapIdOrderByStepNumberAsc(roadmap.getId());
            return roadmapMapper.toResponse(roadmap, steps);
        }).collect(Collectors.toList());
    }

    private List<AiRoadmapStep> evaluateRoadmapWithGemini(Job job, JobMatch match) {
        String systemPrompt = """
            Bạn là một AI Chuyên gia Đào tạo & Định hướng Sự nghiệp (Senior Tech Mentor & Career Coach).
            Nhiệm vụ của bạn là lập một Lộ trình học tập & Cải thiện kỹ năng (Roadmap) chi tiết dựa trên những kỹ năng còn thiếu của Freelancer so với Yêu cầu công việc.

            YÊU CẦU TRẢ VỀ ĐỊNH DẠNG JSON MẢNG (ARRAY OF OBJECTS) DUY NHẤT. Mỗi phần tử chứa các trường:
            1. stepNumber: Thứ tự bước (bắt đầu từ 1, 2, 3...).
            2. missingSkill: Tên kỹ năng còn thiếu tương ứng.
            3. action: Hành động / Bài tập thực hành / Dự án nhỏ cụ thể mà Freelancer cần thực hiện.
            4. resourceUrl: Link tài liệu học tập hoặc khóa học gợi ý chất lượng (Google, Coursera, Udemy, Youtube, Documentation chính thức).
            5. estimatedHours: Số giờ ước tính hoàn thành bước này (số nguyên).
            """;

        String userContent = String.format("""
            --- CÔNG VIỆC (JOB) ---
            Tiêu đề: %s
            Mô tả: %s

            --- ĐÁNH GIÁ GAP KỸ NĂNG ---
            Kỹ năng Freelancer đang thiếu: %s
            Đánh giá sơ bộ của AI Matching: %s
            """,
                job.getTitle() != null ? job.getTitle() : "",
                job.getDescription() != null ? job.getDescription() : "",
                match.getMissingSkills() != null ? String.join(", ", match.getMissingSkills()) : "Chưa xác định",
                match.getExplanation() != null ? match.getExplanation() : ""
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
            String cleanedJson = cleanJsonContent(aiJsonText);

            return objectMapper.readValue(cleanedJson, new TypeReference<List<AiRoadmapStep>>() {});

        } catch (Exception e) {
            log.error("Lỗi khi sinh Roadmap qua Gemini API: ", e);
            return createFallbackSteps(match.getMissingSkills());
        }
    }

    private List<AiRoadmapStep> createFallbackSteps(List<String> missingSkills) {
        if (missingSkills == null || missingSkills.isEmpty()) return Collections.emptyList();

        List<AiRoadmapStep> fallbackList = new ArrayList<>();
        int step = 1;
        for (String skill : missingSkills) {
            fallbackList.add(AiRoadmapStep.builder()
                    .stepNumber(step++)
                    .missingSkill(skill)
                    .action("Nghiên cứu tài liệu chính thức và triển khai 01 bài tập thực hành áp dụng " + skill)
                    .resourceUrl("https://www.google.com/search?q=tutorial+learn+" + skill)
                    .estimatedHours(10)
                    .build());
        }
        return fallbackList;
    }

    private String cleanJsonContent(String rawText) {
        if (rawText == null || rawText.isBlank()) return "[]";
        String cleaned = rawText.trim();
        if (cleaned.startsWith("```json")) cleaned = cleaned.substring(7);
        else if (cleaned.startsWith("```")) cleaned = cleaned.substring(3);
        if (cleaned.endsWith("```")) cleaned = cleaned.substring(0, cleaned.length() - 3);
        return cleaned.trim();
    }
}