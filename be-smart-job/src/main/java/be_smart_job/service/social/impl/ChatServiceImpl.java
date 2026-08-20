package be_smart_job.service.social.impl;

import be_smart_job.dto.req.social.GetOrCreateConversationRequest;
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
    public ConversationResponse getOrCreateConversation(GetOrCreateConversationRequest request) {
        String currentUserId = resolveUserId(SecurityUtils.getCurrentUserId());
        String partnerId = resolveUserId(request.getPartnerId());

        if (currentUserId.equals(partnerId)) {
            throw new IllegalArgumentException("Không thể tự tạo cuộc trò chuyện với chính mình");
        }

        String clientId;
        String freelancerId;

        if (SecurityUtils.hasRole("FREELANCER") && !SecurityUtils.hasRole("CLIENT")) {
            freelancerId = currentUserId;
            clientId = partnerId;
        } else {
            clientId = currentUserId;
            freelancerId = partnerId;
        }

        Conversation conversation = findExistingConversation(clientId, freelancerId, request.getJobId())
                .orElseGet(() -> conversationRepository.save(
                        Conversation.builder()
                                .clientId(clientId)
                                .freelancerId(freelancerId)
                                .jobId(request.getJobId())
                                .build()
                ));

        return mapToConversationResponse(conversation, currentUserId);
    }

    @Override
    public MessageResponse sendMessage(SendMessageRequest request) {
        String currentUserId = resolveUserId(SecurityUtils.getCurrentUserId());
        String receiverId = resolveUserId(request.getReceiverId());

        if (currentUserId.equals(receiverId)) {
            throw new IllegalArgumentException("Không thể tự gửi tin nhắn cho chính mình");
        }

        String clientId;
        String freelancerId;

        if (SecurityUtils.hasRole("FREELANCER") && !SecurityUtils.hasRole("CLIENT")) {
            freelancerId = currentUserId;
            clientId = receiverId;
        } else {
            clientId = currentUserId;
            freelancerId = receiverId;
        }

        Conversation conversation = findExistingConversation(clientId, freelancerId, request.getJobId())
                .orElseGet(() -> conversationRepository.save(
                        Conversation.builder()
                                .clientId(clientId)
                                .freelancerId(freelancerId)
                                .jobId(request.getJobId())
                                .build()
                ));

        Instant now = Instant.now();
        conversation.setLastMessage(request.getContent());
        conversation.setLastMessageAt(now);
        conversationRepository.save(conversation);

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
        String currentUserId = resolveUserId(SecurityUtils.getCurrentUserId());

        List<Conversation> conversations = conversationRepository.findActiveConversationsByUserId(currentUserId);

        return conversations.stream()
                .map(conv -> mapToConversationResponse(conv, currentUserId))
                .toList();
    }

    @Override
    public List<MessageResponse> getMessagesByConversationId(String conversationId) {
        String currentUserId = resolveUserId(SecurityUtils.getCurrentUserId());
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
        String currentUserId = resolveUserId(SecurityUtils.getCurrentUserId());

        List<Message> unreadMessages = messageRepository.findByConversationIdAndReceiverIdAndIsReadFalse(conversationId, currentUserId);
        if (!unreadMessages.isEmpty()) {
            unreadMessages.forEach(msg -> msg.setIsRead(true));
            messageRepository.saveAll(unreadMessages);
        }
    }

    private Optional<Conversation> findExistingConversation(String user1, String user2, String jobId) {
        if (jobId != null && !jobId.isBlank()) {
            return conversationRepository.findByTwoUsersAndJobId(user1, user2, jobId);
        }
        return conversationRepository.findByTwoUsers(user1, user2);
    }

    private ConversationResponse mapToConversationResponse(Conversation conv, String currentUserId) {
        ConversationResponse response = conversationMapper.toResponse(conv);

        String partnerId = currentUserId.equals(conv.getClientId()) ? conv.getFreelancerId() : conv.getClientId();
        response.setPartnerId(partnerId);

        userRepository.findById(partnerId).ifPresent(partner -> {
            String fullName = ((partner.getLastName() != null ? partner.getLastName() : "") + " " +
                    (partner.getFirstName() != null ? partner.getFirstName() : "")).trim();
            response.setPartnerName(fullName.isEmpty() ? partner.getUsername() : fullName);
            response.setPartnerAvatar(partner.getAvatarUrl());
        });

        long unread = messageRepository.countByConversationIdAndReceiverIdAndIsReadFalse(conv.getId(), currentUserId);
        response.setUnreadCount(unread);

        return response;
    }

    /**
     * Chuyển đổi định dạng ID (Email/Username/ObjectId) về chính xác User.id (ObjectId)
     */
    private String resolveUserId(String identifier) {
        if (identifier == null || identifier.isBlank()) {
            throw new IllegalArgumentException("Identifier người dùng không được để trống");
        }

        return userRepository.findById(identifier)
                .map(User::getId)
                .orElseGet(() -> userRepository.findByEmail(identifier)
                        .map(User::getId)
                        .orElseGet(() -> userRepository.findByUsername(identifier)
                                .map(User::getId)
                                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người dùng: " + identifier))));
    }
}