package be_smart_job.dto.res.ai;

import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiMatchResultResponse {
    private Double matchScore;
    private List<String> matchingSkills;
    private List<String> missingSkills;
    private String explanation;
}