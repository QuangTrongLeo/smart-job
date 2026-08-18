package be_smart_job.entity;

import be_smart_job.enums.MatchStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.math.BigDecimal;
import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Document(collection = "job_matches")
@CompoundIndex(name = "job_freelancer_idx", def = "{'job_id': 1, 'freelancer_id': 1}", unique = true)
public class JobMatch extends BaseEntity {

    @Id
    private String id;

    @Indexed
    @Field("job_id")
    private String jobId;

    @Indexed
    @Field("freelancer_id")
    private String freelancerId;

    private Double matchScore;

    @Builder.Default
    private MatchStatus status = MatchStatus.SUGGESTED;

    private String coverLetter;
    private BigDecimal bidAmount;

    // AI Reasoning
    private List<String> matchingSkills;
    private List<String> missingSkills;
    private String explanation;
}