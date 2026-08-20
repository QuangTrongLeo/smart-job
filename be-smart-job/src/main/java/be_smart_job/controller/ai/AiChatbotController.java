package be_smart_job.controller.ai;

import be_smart_job.dto.req.ai.ChatbotReq;
import be_smart_job.dto.res.ApiResponse;
import be_smart_job.dto.res.ai.ChatbotResponse;
import be_smart_job.service.ai.interfaces.ChatbotAiService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ai/chatbot")
@RequiredArgsConstructor
public class AiChatbotController {

    private final ChatbotAiService chatbotAiService;

    @PostMapping(value = "/recommend-jobs", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ChatbotResponse>> recommendJobsFromCv(@Valid @ModelAttribute ChatbotReq request) {

        ChatbotResponse chatbotResponse = chatbotAiService.suggestJobsFromCv(request);

        return ResponseEntity.ok(ApiResponse.of(
                HttpStatus.OK.value(),
                "Tư vấn việc làm từ AI thành công",
                chatbotResponse
        ));
    }
}