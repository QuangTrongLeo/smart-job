package be_smart_job.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
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
@Document(collection = "development_roadmaps")
public class DevelopmentRoadmap extends BaseEntity {

    @Id
    private String id;

    @Indexed
    @Field("match_id")
    private String matchId; // Liên kết tới JobMatch

    @Indexed
    @Field("freelancer_id")
    private String freelancerId;

    private Boolean recommended;
    private Double targetScore;
    private Integer stepNumber;
    private String action;
    private Integer estimatedHours;
}