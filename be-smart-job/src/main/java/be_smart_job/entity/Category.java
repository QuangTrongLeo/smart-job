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
@Document(collection = "categories")
public class Category extends BaseEntity {

    @Id
    private String id;

    @Indexed(unique = true)
    private String name;

    @Indexed
    @Field("parent_id")
    private String parentId;
}