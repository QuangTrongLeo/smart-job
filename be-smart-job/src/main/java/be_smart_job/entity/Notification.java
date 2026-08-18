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
@Document(collection = "notifications")
public class Notification extends BaseEntity {

    @Id
    private String id;

    @Indexed
    @Field("user_id")
    private String userId; // Người nhận thông báo

    private String title;
    private String content;
    private String type; // e.g., "AI_MATCH", "APPLICATION_ACCEPTED"
    private String targetUrl;

    @Builder.Default
    private Boolean isRead = false;
}