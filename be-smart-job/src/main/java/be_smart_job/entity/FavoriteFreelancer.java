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
@Document(collection = "favorite_freelancers")
@CompoundIndexes({
        @CompoundIndex(name = "client_freelancer_unique_idx", def = "{'client_id': 1, 'freelancer_id': 1}", unique = true)
})
public class FavoriteFreelancer extends BaseEntity {

    @Id
    private String id;

    @Indexed
    @Field("client_id")
    private String clientId;

    @Indexed
    @Field("freelancer_id")
    private String freelancerId;
}