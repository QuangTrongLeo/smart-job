package be_smart_job.dto.res.job;

import be_smart_job.dto.res.identity.UserResponse;
import be_smart_job.enums.InvitationStatus;
import lombok.*;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FreelancerInvitationResponse {
    private String id;
    private UserResponse client;
    private FreelancerProfileResponse freelancerProfile;
    private InvitationStatus status;
    private Instant createdAt;
    private Instant updatedAt;
}