package be_smart_job.controller.job;

import be_smart_job.dto.req.job.FreelancerProfileRequest;
import be_smart_job.dto.res.ApiResponse;
import be_smart_job.dto.res.job.FreelancerProfileResponse;
import be_smart_job.service.job.interfaces.FreelancerProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/freelancers")
@RequiredArgsConstructor
public class FreelancerProfileController {

    private final FreelancerProfileService profileService;

    // Xem tất cả danh sách Freelancer (Public)
    @GetMapping
    public ResponseEntity<ApiResponse<List<FreelancerProfileResponse>>> getAllProfiles() {
        List<FreelancerProfileResponse> profiles = profileService.getAllProfiles();
        return ResponseEntity.ok(ApiResponse.of(HttpStatus.OK.value(), "Lấy danh sách Freelancer thành công", profiles));
    }

    // Xem chi tiết hồ sơ Freelancer theo User ID (Public)
    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<FreelancerProfileResponse>> getProfileByUserId(@PathVariable String userId) {
        FreelancerProfileResponse profile = profileService.getProfileByUserId(userId);
        return ResponseEntity.ok(ApiResponse.of(HttpStatus.OK.value(), "Lấy thông tin Freelancer thành công", profile));
    }

    // Xem hồ sơ của chính bản thân Freelancer
    @GetMapping("/me")
    @PreAuthorize("hasRole('FREELANCER') or hasAuthority('FREELANCER')")
    public ResponseEntity<ApiResponse<FreelancerProfileResponse>> getMyProfile() {
        FreelancerProfileResponse profile = profileService.getMyProfile();
        return ResponseEntity.ok(ApiResponse.of(HttpStatus.OK.value(), "Lấy hồ sơ cá nhân thành công", profile));
    }

    // Tạo mới hồ sơ cho bản thân Freelancer
    @PostMapping("/me")
    @PreAuthorize("hasRole('FREELANCER') or hasAuthority('FREELANCER')")
    public ResponseEntity<ApiResponse<FreelancerProfileResponse>> createMyProfile(
            @Valid @RequestBody FreelancerProfileRequest request) {
        FreelancerProfileResponse profile = profileService.createMyProfile(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.of(HttpStatus.CREATED.value(), "Tạo hồ sơ Freelancer thành công", profile));
    }

    // Cập nhật hồ sơ của chính bản thân Freelancer
    @PutMapping("/me")
    @PreAuthorize("hasRole('FREELANCER') or hasAuthority('FREELANCER')")
    public ResponseEntity<ApiResponse<FreelancerProfileResponse>> updateMyProfile(
            @Valid @RequestBody FreelancerProfileRequest request) {
        FreelancerProfileResponse profile = profileService.updateMyProfile(request);
        return ResponseEntity.ok(ApiResponse.of(HttpStatus.OK.value(), "Cập nhật hồ sơ Freelancer thành công", profile));
    }

    // Xóa hồ sơ của chính bản thân Freelancer
    @DeleteMapping("/me")
    @PreAuthorize("hasRole('FREELANCER') or hasAuthority('FREELANCER')")
    public ResponseEntity<ApiResponse<Void>> deleteMyProfile() {
        profileService.deleteMyProfile();
        return ResponseEntity.ok(ApiResponse.of(HttpStatus.OK.value(), "Xóa hồ sơ Freelancer thành công", null));
    }
}