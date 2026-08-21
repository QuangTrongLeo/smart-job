package be_smart_job.dto.res.ai;

import be_smart_job.enums.MatchStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobMatchResponse {
    private String id;
    private String jobId;
    private String freelancerId;
    private Double matchScore;
    private MatchStatus status;
    private String coverLetter;
    private BigDecimal bidAmount;
    private List<String> matchingSkills;
    private List<String> missingSkills;
    private String explanation;
    private Instant createdAt;
    private Instant updatedAt;
}