package be_smart_job.dto.req.social;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GetOrCreateConversationRequest {

    @NotBlank(message = "ID người nhận/đối phương không được để trống")
    private String partnerId;

    private String jobId; // Tuỳ chọn (có thể null nếu chat trực tiếp từ profile)
}