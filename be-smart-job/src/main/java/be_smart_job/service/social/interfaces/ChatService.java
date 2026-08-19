package be_smart_job.service.social.interfaces;

import be_smart_job.dto.req.social.SendMessageRequest;
import be_smart_job.dto.res.social.ConversationResponse;
import be_smart_job.dto.res.social.MessageResponse;

import java.util.List;

public interface ChatService {
    MessageResponse sendMessage(SendMessageRequest request);
    List<ConversationResponse> getMyConversations();
    List<MessageResponse> getMessagesByConversationId(String conversationId);
    void markConversationAsRead(String conversationId);
}