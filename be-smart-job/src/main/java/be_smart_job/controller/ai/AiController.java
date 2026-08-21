package be_smart_job.controller.ai;

import be_smart_job.dto.req.ai.ChatbotReq;
import be_smart_job.dto.req.ai.JobMatchReq;
import be_smart_job.dto.req.ai.JobParseReq;
import be_smart_job.dto.req.ai.RoadmapReq;
import be_smart_job.dto.res.ApiResponse;
import be_smart_job.dto.res.ai.*;
import be_smart_job.service.ai.interfaces.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/ai")
@RequiredArgsConstructor
public class AiController {

    private final ChatBotService chatBotService;
    private final JobParsingService jobParsingService;
    private final CvParsingService cvParsingService;
    private final JobMatchService jobMatchService;
    private final RoadmapService roadmapService;

    @PostMapping(value = "/chatbot", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<ChatbotResponse> chat(
            @Valid @ModelAttribute ChatbotReq request
    ) {
        ChatbotResponse response = chatBotService.chatAndRecommendJobs(request);
        return ApiResponse.of(HttpStatus.OK.value(), "Xử lý thông tin thành công", response);
    }

    // Chỉ có tài khoản vai trò CLIENT mới có quyền bóc tách Job
    @PostMapping("/parse-job")
    @PreAuthorize("hasRole('CLIENT') or hasAuthority('CLIENT')")
    public ApiResponse<JobParseResponse> parseJobDescription(
            @Valid @RequestBody JobParseReq request
    ) {
        JobParseResponse response = jobParsingService.parseJobDescription(request);
        return ApiResponse.of(HttpStatus.OK.value(), "Bóc tách và chuẩn hóa thông tin công việc thành công", response);
    }

    @PostMapping(value = "/parse-cv", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('FREELANCER') or hasAuthority('FREELANCER')")
    public ApiResponse<CvParseResponse> parseCv(
            @RequestParam("file") MultipartFile file
    ) {
        CvParseResponse response = cvParsingService.parseCvFile(file);
        return ApiResponse.of(HttpStatus.OK.value(), "Bóc tách hồ sơ CV bằng AI thành công", response);
    }

    // Ghép nối thông minh & giải thích lý do ghép nối
    @PostMapping("/match")
    @PreAuthorize("hasAnyRole('CLIENT', 'FREELANCER') or hasAnyAuthority('CLIENT', 'FREELANCER')")
    public ApiResponse<JobMatchResponse> matchFreelancerToJob(
            @Valid @RequestBody JobMatchReq request
    ) {
        JobMatchResponse response = jobMatchService.matchFreelancerToJob(request);
        return ApiResponse.of(HttpStatus.OK.value(), "Tính toán ghép nối AI thành công", response);
    }

    // ---------------- AI ROADMAP GENERATION ----------------

    // 1. Tạo Lộ trình Phát triển Kỹ năng (Dành cho Freelancer/Client)
    @PostMapping("/roadmap/generate")
    @PreAuthorize("hasAnyRole('CLIENT', 'FREELANCER') or hasAnyAuthority('CLIENT', 'FREELANCER')")
    public ApiResponse<RoadmapResponse> generateRoadmap(
            @Valid @RequestBody RoadmapReq request
    ) {
        RoadmapResponse response = roadmapService.generateRoadmap(request);
        return ApiResponse.of(HttpStatus.OK.value(), "Tạo lộ trình phát triển kỹ năng AI thành công", response);
    }

    // 2. Lấy chi tiết lộ trình theo matchId
    @GetMapping("/roadmap/match/{matchId}")
    @PreAuthorize("hasAnyRole('CLIENT', 'FREELANCER') or hasAnyAuthority('CLIENT', 'FREELANCER')")
    public ApiResponse<RoadmapResponse> getRoadmapByMatchId(
            @PathVariable("matchId") String matchId
    ) {
        RoadmapResponse response = roadmapService.getRoadmapByMatchId(matchId);
        return ApiResponse.of(HttpStatus.OK.value(), "Lấy lộ trình phát triển thành công", response);
    }

    // 3. Đánh dấu hoàn thành một bước trong Lộ trình
    @PatchMapping("/roadmap/step/{stepId}/complete")
    @PreAuthorize("hasRole('FREELANCER') or hasAuthority('FREELANCER')")
    public ApiResponse<RoadmapStepResponse> toggleStepCompletion(
            @PathVariable("stepId") String stepId,
            @RequestParam(value = "completed", defaultValue = "true") Boolean completed
    ) {
        RoadmapStepResponse response = roadmapService.toggleStepCompletion(stepId, completed);
        return ApiResponse.of(HttpStatus.OK.value(), "Cập nhật trạng thái bước học tập thành công", response);
    }

    // 4. Lấy danh sách tất cả Lộ trình của Freelancer đang đăng nhập
    @GetMapping("/roadmap/my-roadmaps")
    @PreAuthorize("hasRole('FREELANCER') or hasAuthority('FREELANCER')")
    public ApiResponse<List<RoadmapResponse>> getMyRoadmaps() {
        List<RoadmapResponse> responses = roadmapService.getMyRoadmaps();
        return ApiResponse.of(HttpStatus.OK.value(), "Lấy danh sách lộ trình của tôi thành công", responses);
    }
}