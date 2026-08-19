package be_smart_job.dto.res.job;

import lombok.*;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryResponse {
    private String id;
    private String name;
    private Instant createdAt;
    private Instant updatedAt;
}
