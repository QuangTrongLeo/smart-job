package be_smart_job.dto.res.job;

import be_smart_job.dto.res.identity.UserResponse;
import be_smart_job.enums.ProposalStatus;
import lombok.*;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobProposalResponse {
    private String id;
    private String jobId;
    private UserResponse client;
    private FreelancerProfileResponse freelancerProfile;
    private ProposalStatus status;
    private Instant createdAt;
    private Instant updatedAt;
}