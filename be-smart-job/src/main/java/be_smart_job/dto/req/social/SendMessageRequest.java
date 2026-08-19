package be_smart_job.dto.req.social;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SendMessageRequest {

    @NotBlank(message = "ID người nhận không được để trống")
    private String receiverId;

    private String jobId;

    @NotBlank(message = "Nội dung tin nhắn không được để trống")
    private String content;
}