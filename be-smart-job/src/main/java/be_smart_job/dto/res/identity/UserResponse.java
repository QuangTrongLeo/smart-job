package be_smart_job.dto.res.identity;

import be_smart_job.enums.UserStatus;
import lombok.Data;

@Data
public class UserResponse {
    private String id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String avatarUrl;
    private String roleId;
    private UserStatus status;
}
