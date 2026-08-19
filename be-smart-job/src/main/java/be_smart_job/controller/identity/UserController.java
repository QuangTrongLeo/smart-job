package be_smart_job.controller.identity;

import be_smart_job.dto.req.identity.ChangePasswordRequest;
import be_smart_job.dto.req.identity.UserUpdateRequest;
import be_smart_job.dto.res.ApiResponse;
import be_smart_job.dto.res.identity.UserResponse;
import be_smart_job.enums.UserStatus;
import be_smart_job.service.identity.interfaces.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // Xem danh sách người dùng (Public)
    @GetMapping
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        List<UserResponse> users = userService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.of(HttpStatus.OK.value(), "Lấy danh sách người dùng thành công", users));
    }

    // Xem thông tin chi tiết một user (Public)
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable String id) {
        UserResponse user = userService.getUserById(id);
        return ResponseEntity.ok(ApiResponse.of(HttpStatus.OK.value(), "Lấy thông tin người dùng thành công", user));
    }

    // Lấy thông tin tài khoản đang đăng nhập
    @GetMapping("/my-profile")
    public ResponseEntity<ApiResponse<UserResponse>> getMyProfile() {
        UserResponse user = userService.getMyProfile();
        return ResponseEntity.ok(ApiResponse.of(HttpStatus.OK.value(), "Lấy thông tin cá nhân thành công", user));
    }

    // Cập nhật thông tin cá nhân chính chủ
    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(@RequestBody UserUpdateRequest request) {
        UserResponse user = userService.updateProfile(request);
        return ResponseEntity.ok(ApiResponse.of(HttpStatus.OK.value(), "Cập nhật thông tin thành công", user));
    }

    // Cập nhật ảnh đại diện chính chủ
    @PostMapping(value = "/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<UserResponse>> uploadAvatar(@RequestParam("file") MultipartFile file) {
        UserResponse user = userService.uploadAvatar(file);
        return ResponseEntity.ok(ApiResponse.of(HttpStatus.OK.value(), "Cập nhật ảnh đại diện thành công", user));
    }

    // Đổi mật khẩu chính chủ
    @PutMapping("/change-password")
    public ResponseEntity<ApiResponse<Void>> changePassword(@RequestBody ChangePasswordRequest request) {
        userService.changePassword(request);
        return ResponseEntity.ok(ApiResponse.of(HttpStatus.OK.value(), "Đổi mật khẩu thành công", null));
    }

    // Khóa/Mở khóa tài khoản (Chỉ ADMIN)
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('ADMIN')")
    public ResponseEntity<ApiResponse<UserResponse>> updateStatus(
            @PathVariable String id,
            @RequestParam UserStatus status) {
        UserResponse user = userService.updateStatus(id, status);
        return ResponseEntity.ok(ApiResponse.of(HttpStatus.OK.value(), "Cập nhật trạng thái người dùng thành công", user));
    }

    // Xóa tài khoản (Chỉ ADMIN)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.of(HttpStatus.OK.value(), "Xóa người dùng thành công", null));
    }
}