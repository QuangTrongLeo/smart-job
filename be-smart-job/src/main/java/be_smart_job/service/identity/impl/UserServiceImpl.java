package be_smart_job.service.identity.impl;

import be_smart_job.dto.req.identity.ChangePasswordRequest;
import be_smart_job.dto.req.identity.UserUpdateRequest;
import be_smart_job.dto.res.identity.UserResponse;
import be_smart_job.entity.User;
import be_smart_job.enums.UserStatus;
import be_smart_job.mapper.identity.UserMapper;
import be_smart_job.repository.identity.UserRepository;
import be_smart_job.service.file.FileStorageService;
import be_smart_job.service.identity.interfaces.UserService;
import be_smart_job.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final FileStorageService fileStorageService;
    private final PasswordEncoder passwordEncoder;

    @Override
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(userMapper::toResponse)
                .toList();
    }

    @Override
    public UserResponse getUserById(String id) {
        User user = findUserById(id);
        return userMapper.toResponse(user);
    }

    @Override
    public UserResponse getMyProfile() {
        String currentUserEmail = SecurityUtils.getCurrentUserId(); // Trả về Email từ Access Token
        User user = findUserByEmail(currentUserEmail);
        return userMapper.toResponse(user);
    }

    @Override
    public UserResponse updateProfile(UserUpdateRequest request) {
        String currentUserEmail = SecurityUtils.getCurrentUserId();
        User user = findUserByEmail(currentUserEmail);
        userMapper.updateUserFromRequest(request, user);
        User updatedUser = userRepository.save(user);
        return userMapper.toResponse(updatedUser);
    }

    @Override
    public UserResponse uploadAvatar(MultipartFile file) {
        String currentUserEmail = SecurityUtils.getCurrentUserId();
        User user = findUserByEmail(currentUserEmail);

        if (user.getAvatarUrl() != null && !user.getAvatarUrl().isEmpty()) {
            fileStorageService.deleteByUrl(user.getAvatarUrl());
        }

        String avatarUrl = fileStorageService.upload(file, "avatars");
        user.setAvatarUrl(avatarUrl);

        User savedUser = userRepository.save(user);
        return userMapper.toResponse(savedUser);
    }

    @Override
    public void changePassword(ChangePasswordRequest request) {
        String currentUserEmail = SecurityUtils.getCurrentUserId();
        User user = findUserByEmail(currentUserEmail);

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Mật khẩu cũ không chính xác");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Override
    public UserResponse updateStatus(String id, UserStatus status) {
        User user = findUserById(id);
        user.setStatus(status);
        User updatedUser = userRepository.save(user);
        return userMapper.toResponse(updatedUser);
    }

    @Override
    public void deleteUser(String id) {
        User user = findUserById(id);
        if (user.getAvatarUrl() != null) {
            fileStorageService.deleteByUrl(user.getAvatarUrl());
        }
        userRepository.delete(user);
    }

    private User findUserById(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người dùng với ID: " + id));
    }

    private User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người dùng với email: " + email));
    }
}