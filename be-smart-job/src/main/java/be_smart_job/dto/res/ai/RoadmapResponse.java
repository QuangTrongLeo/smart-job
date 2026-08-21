package be_smart_job.dto.res.ai;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant; // Dùng Instant thay cho LocalDateTime
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoadmapResponse {
    private String id;
    private String matchId;
    private String freelancerId;
    private String jobId;
    private Double currentScore;
    private Double targetScore;
    private Integer totalSteps;
    private Integer completedSteps;
    private List<RoadmapStepResponse> steps;
    private Instant createdAt; // Sửa kiểu dữ liệu ở đây
    private Instant updatedAt; // Sửa kiểu dữ liệu ở đây
}