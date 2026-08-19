package be_smart_job.entity;

import lombok.*;
import lombok.experimental.SuperBuilder;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.Instant;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Document(collection = "conversations")
public class Conversation extends BaseEntity {

    @Id
    private String id;

    @Indexed
    @Field("job_id")
    private String jobId; // Có thể null nếu chat trực tiếp không gắn công việc

    @Indexed
    @Field("client_id")
    private String clientId;

    @Indexed
    @Field("freelancer_id")
    private String freelancerId;

    private String lastMessage;
    private Instant lastMessageAt;
}