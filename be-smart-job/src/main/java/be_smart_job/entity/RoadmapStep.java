package be_smart_job.entity;

import lombok.*;
import lombok.experimental.SuperBuilder;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Document(collection = "roadmap_steps")
@CompoundIndexes({
        @CompoundIndex(name = "roadmap_step_idx", def = "{'roadmap_id': 1, 'step_number': 1}", unique = true)
})
public class RoadmapStep extends BaseEntity {

    @Id
    private String id;

    @Indexed
    @Field("roadmap_id")
    private String roadmapId;

    @Field("step_number")
    private Integer stepNumber;

    private String missingSkill;
    private String action;
    private String resourceUrl;
    private Integer estimatedHours;

    @Builder.Default
    private Boolean isCompleted = false;
}