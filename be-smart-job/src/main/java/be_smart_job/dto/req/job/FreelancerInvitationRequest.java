package be_smart_job.dto.req.job;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FreelancerInvitationRequest {

    @NotBlank(message = "ID hồ sơ Freelancer không được để trống")
    private String freelancerProfileId;
}