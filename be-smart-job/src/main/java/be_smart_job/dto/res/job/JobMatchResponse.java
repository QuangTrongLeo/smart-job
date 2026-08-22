package be_smart_job.dto.res.job;

import be_smart_job.dto.res.identity.UserResponse;
import be_smart_job.enums.MatchStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobMatchResponse {
    private String id;

    // Chi tiết Job & Freelancer
    private JobResponse job;
    private UserResponse freelancer;

    // Điểm số & Trạng thái Match
    private Double matchScore;
    private MatchStatus status;
    private String coverLetter;
    private BigDecimal bidAmount;

    // AI Reasoning
    private List<String> matchingSkills;
    private List<String> missingSkills;
    private String explanation;

    private Instant createdAt;
    private Instant updatedAt;
}