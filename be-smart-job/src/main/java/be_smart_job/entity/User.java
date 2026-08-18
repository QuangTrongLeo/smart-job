package be_smart_job.entity;

import be_smart_job.enums.UserStatus;
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
@Document(collection = "users")
public class User extends BaseEntity {

    @Id
    private String id;

    @Indexed(unique = true)
    private String username;

    @Indexed(unique = true)
    private String email;

    private String password;
    private String firstName;
    private String lastName;
    private String avatarUrl;

    @Indexed
    @Field("role_id")
    private String roleId; // Liên kết đến Role Entity

    @Builder.Default
    private UserStatus status = UserStatus.UNVERIFIED;
}