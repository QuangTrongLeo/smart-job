package be_smart_job.service.identity.interfaces;

import be_smart_job.dto.req.identity.ChangePasswordRequest;
import be_smart_job.dto.req.identity.UserUpdateRequest;
import be_smart_job.dto.res.identity.UserResponse;
import be_smart_job.enums.UserStatus;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface UserService {
    List<UserResponse> getAllUsers();
    UserResponse getUserById(String id);
    UserResponse getMyProfile();
    UserResponse updateProfile(UserUpdateRequest request);
    UserResponse uploadAvatar(MultipartFile file);
    void changePassword(ChangePasswordRequest request);
    UserResponse updateStatus(String id, UserStatus status);
    void deleteUser(String id);
}