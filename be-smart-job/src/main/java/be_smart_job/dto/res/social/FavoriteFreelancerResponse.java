package be_smart_job.dto.res.social;

import be_smart_job.dto.res.job.FreelancerProfileResponse;
import lombok.*;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FavoriteFreelancerResponse {
    private String id;
    private String clientId;
    private FreelancerProfileResponse freelancer;
    private Instant createdAt;
}