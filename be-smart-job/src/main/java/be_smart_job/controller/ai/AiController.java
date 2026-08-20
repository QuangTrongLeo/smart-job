package be_smart_job.controller.ai;

import be_smart_job.dto.req.ai.ChatbotReq;
import be_smart_job.dto.req.ai.JobParseReq;
import be_smart_job.dto.res.ApiResponse;
import be_smart_job.dto.res.ai.ChatbotResponse;
import be_smart_job.dto.res.ai.JobParseResponse;
import be_smart_job.service.ai.interfaces.ChatBotService;
import be_smart_job.service.ai.interfaces.JobParsingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ai")
@RequiredArgsConstructor
public class AiController {

    private final ChatBotService chatBotService;
    private final JobParsingService jobParsingService;

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
}