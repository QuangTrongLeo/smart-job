package be_smart_job.entity;

import lombok.*;
import lombok.experimental.SuperBuilder;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Document(collection = "roadmaps")
public class Roadmap extends BaseEntity {

    @Id
    private String id;

    @Indexed
    @Field("match_id")
    private String matchId;

    @Indexed
    @Field("freelancer_id")
    private String freelancerId;

    @Indexed
    @Field("job_id")
    private String jobId;

    private Double currentScore;
    private Double targetScore;
    private Integer totalSteps;

    @Builder.Default
    private Integer completedSteps = 0;
}