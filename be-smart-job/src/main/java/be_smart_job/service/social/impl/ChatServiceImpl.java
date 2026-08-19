package be_smart_job.service.social.impl;

import be_smart_job.dto.req.social.SendMessageRequest;
import be_smart_job.dto.res.social.ConversationResponse;
import be_smart_job.dto.res.social.MessageResponse;
import be_smart_job.entity.Conversation;
import be_smart_job.entity.Message;
import be_smart_job.entity.User;
import be_smart_job.mapper.social.ConversationMapper;
import be_smart_job.mapper.social.MessageMapper;
import be_smart_job.repository.identity.UserRepository;
import be_smart_job.repository.social.ConversationRepository;
import be_smart_job.repository.social.MessageRepository;
import be_smart_job.service.social.interfaces.ChatService;
import be_smart_job.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    private final MessageMapper messageMapper;
    private final ConversationMapper conversationMapper;

    @Override
    public MessageResponse sendMessage(SendMessageRequest request) {
        String currentUserId = SecurityUtils.getCurrentUserId();
        String receiverId = request.getReceiverId();

        if (currentUserId.equals(receiverId)) {
            throw new IllegalArgumentException("Không thể tự gửi tin nhắn cho chính mình");
        }

        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người nhận với ID: " + receiverId));

        // Phân định ai là Client, ai là Freelancer
        String clientId = SecurityUtils.hasRole("CLIENT") ? currentUserId : receiverId;
        String freelancerId = SecurityUtils.hasRole("FREELANCER") ? currentUserId : receiverId;

        // Tìm hoặc tạo Conversation
        Conversation conversation = getOrCreateConversation(clientId, freelancerId, request.getJobId());

        Instant now = Instant.now();
        conversation.setLastMessage(request.getContent());
        conversation.setLastMessageAt(now);
        conversationRepository.save(conversation);

        // Lưu Message
        Message message = Message.builder()
                .conversationId(conversation.getId())
                .jobId(request.getJobId())
                .senderId(currentUserId)
                .receiverId(receiverId)
                .content(request.getContent())
                .isRead(false)
                .build();

        Message savedMessage = messageRepository.save(message);
        return messageMapper.toResponse(savedMessage);
    }

    @Override
    public List<ConversationResponse> getMyConversations() {
        String currentUserId = SecurityUtils.getCurrentUserId();

        List<Conversation> conversations = conversationRepository
                .findByClientIdOrFreelancerIdOrderByLastMessageAtDesc(currentUserId, currentUserId);

        return conversations.stream().map(conv -> {
            ConversationResponse response = conversationMapper.toResponse(conv);

            String partnerId = currentUserId.equals(conv.getClientId()) ? conv.getFreelancerId() : conv.getClientId();
            response.setPartnerId(partnerId);

            userRepository.findById(partnerId).ifPresent(partner -> {
                String fullName = (partner.getLastName() != null ? partner.getLastName() + " " : "") +
                        (partner.getFirstName() != null ? partner.getFirstName() : "");
                response.setPartnerName(fullName.trim());
                response.setPartnerAvatar(partner.getAvatarUrl());
            });

            long unread = messageRepository.countByConversationIdAndReceiverIdAndIsReadFalse(conv.getId(), currentUserId);
            response.setUnreadCount(unread);

            return response;
        }).toList();
    }

    @Override
    public List<MessageResponse> getMessagesByConversationId(String conversationId) {
        String currentUserId = SecurityUtils.getCurrentUserId();
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy cuộc trò chuyện"));

        if (!currentUserId.equals(conversation.getClientId()) && !currentUserId.equals(conversation.getFreelancerId())) {
            throw new AccessDeniedException("Bạn không có quyền xem cuộc trò chuyện này");
        }

        List<Message> messages = messageRepository.findByConversationIdOrderByCreatedAtAsc(conversationId);
        return messageMapper.toResponseList(messages);
    }

    @Override
    public void markConversationAsRead(String conversationId) {
        String currentUserId = SecurityUtils.getCurrentUserId();

        List<Message> unreadMessages = messageRepository.findByConversationIdAndReceiverIdAndIsReadFalse(conversationId, currentUserId);
        if (!unreadMessages.isEmpty()) {
            unreadMessages.forEach(msg -> msg.setIsRead(true));
            messageRepository.saveAll(unreadMessages);
        }
    }

    private Conversation getOrCreateConversation(String clientId, String freelancerId, String jobId) {
        Optional<Conversation> existing;
        if (jobId != null && !jobId.isBlank()) {
            existing = conversationRepository.findByClientIdAndFreelancerIdAndJobId(clientId, freelancerId, jobId);
        } else {
            existing = conversationRepository.findByClientIdAndFreelancerId(clientId, freelancerId);
        }

        return existing.orElseGet(() -> conversationRepository.save(
                Conversation.builder()
                        .clientId(clientId)
                        .freelancerId(freelancerId)
                        .jobId(jobId)
                        .build()
        ));
    }
}