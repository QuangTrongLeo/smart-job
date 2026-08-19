package be_smart_job.controller.social;

import be_smart_job.dto.req.social.SendMessageRequest;
import be_smart_job.dto.res.ApiResponse;
import be_smart_job.dto.res.social.ConversationResponse;
import be_smart_job.dto.res.social.MessageResponse;
import be_smart_job.service.social.interfaces.ChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    // Gửi tin nhắn
    @PostMapping("/messages")
    public ResponseEntity<ApiResponse<MessageResponse>> sendMessage(@Valid @RequestBody SendMessageRequest request) {
        MessageResponse response = chatService.sendMessage(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.of(HttpStatus.CREATED.value(), "Gửi tin nhắn thành công", response));
    }

    // Lấy danh sách các cuộc trò chuyện của tôi
    @GetMapping("/conversations")
    public ResponseEntity<ApiResponse<List<ConversationResponse>>> getMyConversations() {
        List<ConversationResponse> conversations = chatService.getMyConversations();
        return ResponseEntity.ok(ApiResponse.of(HttpStatus.OK.value(), "Lấy danh sách trò chuyện thành công", conversations));
    }

    // Lấy danh sách tin nhắn trong 1 cuộc trò chuyện
    @GetMapping("/conversations/{conversationId}/messages")
    public ResponseEntity<ApiResponse<List<MessageResponse>>> getMessagesByConversationId(@PathVariable String conversationId) {
        List<MessageResponse> messages = chatService.getMessagesByConversationId(conversationId);
        return ResponseEntity.ok(ApiResponse.of(HttpStatus.OK.value(), "Lấy chi tiết tin nhắn thành công", messages));
    }

    // Đánh dấu đã đọc tất cả tin nhắn trong cuộc trò chuyện
    @PutMapping("/conversations/{conversationId}/read")
    public ResponseEntity<ApiResponse<Void>> markConversationAsRead(@PathVariable String conversationId) {
        chatService.markConversationAsRead(conversationId);
        return ResponseEntity.ok(ApiResponse.of(HttpStatus.OK.value(), "Đã đánh dấu tin nhắn là đã đọc", null));
    }
}