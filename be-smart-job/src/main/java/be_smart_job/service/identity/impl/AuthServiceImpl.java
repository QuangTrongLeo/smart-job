package be_smart_job.service.identity.impl;

import be_smart_job.dto.req.identity.LoginRequest;
import be_smart_job.dto.req.identity.RefreshTokenRequest;
import be_smart_job.dto.req.identity.RegisterRequest;
import be_smart_job.dto.res.identity.AuthResponse;
import be_smart_job.dto.res.identity.UserResponse;
import be_smart_job.entity.Role;
import be_smart_job.entity.User;
import be_smart_job.enums.UserStatus;
import be_smart_job.mapper.identity.UserMapper;
import be_smart_job.repository.identity.RoleRepository;
import be_smart_job.repository.identity.UserRepository;
import be_smart_job.security.JwtTokenProvider;
import be_smart_job.service.identity.interfaces.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public UserResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email đã được sử dụng");
        }
        Role role = roleRepository.findByName(request.getRoleType())
                .orElseThrow(() -> new IllegalArgumentException("Role không tồn tại: " + request.getRoleType()));

        User user = userMapper.toEntity(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRoleId(role.getId());
        user.setStatus(UserStatus.ACTIVE);

        User savedUser = userRepository.save(user);
        return userMapper.toResponse(savedUser);
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        // Tìm user trực tiếp bằng Email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Tài khoản hoặc mật khẩu không chính xác"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Tài khoản hoặc mật khẩu không chính xác");
        }

        Role role = roleRepository.findById(user.getRoleId())
                .orElseThrow(() -> new IllegalStateException("Role của người dùng không hợp lệ"));

        String accessToken = jwtTokenProvider.generateAccessToken(user.getId(), user.getEmail(), role.getName().name());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .user(userMapper.toResponse(user))
                .build();
    }

    @Override
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        String token = request.getRefreshToken();
        if (!jwtTokenProvider.validateToken(token)) {
            throw new IllegalArgumentException("Refresh Token không hợp lệ hoặc đã hết hạn");
        }

        String userId = jwtTokenProvider.getUserIdFromToken(token);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Người dùng không tồn tại"));

        Role role = roleRepository.findById(user.getRoleId())
                .orElseThrow(() -> new IllegalStateException("Role không hợp lệ"));

        String newAccessToken = jwtTokenProvider.generateAccessToken(user.getId(), user.getEmail(), role.getName().name());
        String newRefreshToken = jwtTokenProvider.generateRefreshToken(user.getId());

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .tokenType("Bearer")
                .user(userMapper.toResponse(user))
                .build();
    }
}
