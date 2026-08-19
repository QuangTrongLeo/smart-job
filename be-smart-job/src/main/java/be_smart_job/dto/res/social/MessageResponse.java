package be_smart_job.dto.res.social;

import lombok.*;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageResponse {
    private String id;
    private String conversationId;
    private String jobId;
    private String senderId;
    private String receiverId;
    private String content;
    private Boolean isRead;
    private Instant createdAt;
}