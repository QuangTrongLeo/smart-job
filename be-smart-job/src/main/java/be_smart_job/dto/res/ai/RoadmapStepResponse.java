package be_smart_job.dto.res.ai;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant; // Sửa LocalDateTime -> Instant

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoadmapStepResponse {
    private String id;
    private String roadmapId;
    private Integer stepNumber;
    private String missingSkill;
    private String action;
    private String resourceUrl;
    private Integer estimatedHours;
    private Boolean isCompleted;
    private Instant createdAt; // Sửa kiểu ở đây
    private Instant updatedAt; // Sửa kiểu ở đây
}