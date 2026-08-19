package be_smart_job.dto.req.identity;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;
}