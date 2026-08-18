package be_smart_job.entity;

import be_smart_job.enums.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Builder; // Thêm import này nếu chưa có
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

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
    private String email;
    private String password;
    private String avatarUrl;

    @Builder.Default
    private UserStatus status = UserStatus.ACTIVE;

    @DBRef
    private Role role;
}