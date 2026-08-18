package be_smart_job.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
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
@Document(collection = "messages")
public class Message extends BaseEntity {

    @Id
    private String id;

    @Indexed
    @Field("job_id")
    private String jobId;

    @Indexed
    @Field("sender_id")
    private String senderId;

    @Indexed
    @Field("receiver_id")
    private String receiverId;

    private String content;

    @Builder.Default
    private Boolean isRead = false;
}