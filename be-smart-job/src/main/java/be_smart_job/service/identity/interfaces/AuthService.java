package be_smart_job.service.identity.interfaces;

import be_smart_job.dto.req.identity.LoginRequest;
import be_smart_job.dto.req.identity.RefreshTokenRequest;
import be_smart_job.dto.req.identity.RegisterRequest;
import be_smart_job.dto.res.identity.AuthResponse;
import be_smart_job.dto.res.identity.UserResponse;

public interface AuthService {
    UserResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    AuthResponse refreshToken(RefreshTokenRequest request);
}
