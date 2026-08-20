package be_smart_job.controller.ai;

import be_smart_job.dto.req.ai.ChatbotReq;
import be_smart_job.dto.res.ApiResponse;
import be_smart_job.dto.res.ai.ChatbotResponse;
import be_smart_job.service.ai.interfaces.ChatBotService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ai")
@RequiredArgsConstructor
public class AiController {

    private final ChatBotService aiService;

    @PostMapping(value = "/chat", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<ChatbotResponse> chat(
            @Valid @ModelAttribute ChatbotReq request
    ) {
        ChatbotResponse response = aiService.chatAndRecommendJobs(request);
        return ApiResponse.of(HttpStatus.OK.value(), "Xử lý thông tin thành công", response);
    }
}
