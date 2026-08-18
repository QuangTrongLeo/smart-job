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
@Document(collection = "favorite_jobs")
@CompoundIndexes({
        @CompoundIndex(name = "freelancer_job_unique_idx", def = "{'freelancer_id': 1, 'job_id': 1}", unique = true)
})
public class FavoriteJob extends BaseEntity {

    @Id
    private String id;

    @Indexed
    @Field("freelancer_id")
    private String freelancerId;

    @Indexed
    @Field("job_id")
    private String jobId;
}