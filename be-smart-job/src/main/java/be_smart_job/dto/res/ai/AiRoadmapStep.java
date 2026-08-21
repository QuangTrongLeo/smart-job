package be_smart_job.dto.res.ai;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiRoadmapStep {
    private Integer stepNumber;
    private String missingSkill;
    private String action;
    private String resourceUrl;
    private Integer estimatedHours;
}