package be_smart_job.dto.res.social;

import be_smart_job.dto.res.job.JobResponse;
import lombok.*;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FavoriteJobResponse {
    private String id;
    private String freelancerId;
    private JobResponse job;
    private Instant createdAt;
}