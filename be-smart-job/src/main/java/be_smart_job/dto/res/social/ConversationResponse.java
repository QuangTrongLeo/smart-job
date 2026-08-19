package be_smart_job.dto.res.social;

import lombok.*;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConversationResponse {
    private String id;
    private String jobId;
    private String clientId;
    private String freelancerId;

    // Thông tin đối phương đang trò chuyện cùng
    private String partnerId;
    private String partnerName;
    private String partnerAvatar;

    private String lastMessage;
    private Instant lastMessageAt;
    private Long unreadCount;
}