package be_smart_job.dto.req.identity;

import be_smart_job.enums.RoleType;
import lombok.Data;

@Data
public class RegisterRequest {
    private String username;
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private RoleType roleType; // FREELANCER, CLIENT, ADMIN
}
