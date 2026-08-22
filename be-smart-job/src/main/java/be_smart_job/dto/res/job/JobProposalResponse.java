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

    // 1. Thông tin Job được ứng tuyển
    private JobResponse job;

    // 2. Thông tin Client đăng job này
    private UserResponse client;

    // 3. Thông tin tài khoản Freelancer nộp đơn
    private UserResponse freelancer;

    // 4. Hồ sơ năng lực Freelancer nộp kèm
    private FreelancerProfileResponse freelancerProfile;

    private ProposalStatus status;
    private Instant createdAt;
    private Instant updatedAt;
}