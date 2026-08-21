package be_smart_job.controller.job;

import be_smart_job.dto.req.job.FreelancerInvitationRequest;
import be_smart_job.dto.res.ApiResponse;
import be_smart_job.dto.res.job.FreelancerInvitationResponse;
import be_smart_job.enums.InvitationStatus;
import be_smart_job.service.job.interfaces.FreelancerInvitationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/freelancers/invitations")
@RequiredArgsConstructor
public class FreelancerInvitationController {

    private final FreelancerInvitationService invitationService;

    // Client nhấn nút "Gửi lời mời hợp tác" từ giao diện Freelancer Profile
    @PostMapping
    @PreAuthorize("hasRole('CLIENT') or hasAuthority('CLIENT')")
    public ResponseEntity<ApiResponse<FreelancerInvitationResponse>> sendInvitation(
            @Valid @RequestBody FreelancerInvitationRequest request) {
        FreelancerInvitationResponse response = invitationService.sendInvitation(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.of(HttpStatus.CREATED.value(), "Gửi lời mời hợp tác thành công", response));
    }

    // Client xem danh sách lời mời mình đã gửi
    @GetMapping("/sent")
    @PreAuthorize("hasRole('CLIENT') or hasAuthority('CLIENT')")
    public ResponseEntity<ApiResponse<List<FreelancerInvitationResponse>>> getSentInvitations() {
        List<FreelancerInvitationResponse> list = invitationService.getSentInvitations();
        return ResponseEntity.ok(ApiResponse.of(HttpStatus.OK.value(), "Lấy danh sách lời mời đã gửi thành công", list));
    }

    // Freelancer xem danh sách yêu cầu lời mời hợp tác nhận được (Có thể lọc ?status=PENDING)
    @GetMapping("/received")
    @PreAuthorize("hasRole('FREELANCER') or hasAuthority('FREELANCER')")
    public ResponseEntity<ApiResponse<List<FreelancerInvitationResponse>>> getReceivedInvitations(
            @RequestParam(required = false) InvitationStatus status) {
        List<FreelancerInvitationResponse> list = invitationService.getReceivedInvitations(status);
        return ResponseEntity.ok(ApiResponse.of(HttpStatus.OK.value(), "Lấy danh sách lời mời nhận được thành công", list));
    }

    // Freelancer Phản hồi lời mời (?status=ACCEPTED hoặc REJECTED)
    @PatchMapping("/{id}/respond")
    @PreAuthorize("hasRole('FREELANCER') or hasAuthority('FREELANCER')")
    public ResponseEntity<ApiResponse<FreelancerInvitationResponse>> respondToInvitation(
            @PathVariable String id,
            @RequestParam InvitationStatus status) {
        FreelancerInvitationResponse response = invitationService.respondToInvitation(id, status);
        return ResponseEntity.ok(ApiResponse.of(HttpStatus.OK.value(), "Phản hồi lời mời thành công", response));
    }

    // Client Hủy lời mời hợp tác
    @DeleteMapping("/{id}/cancel")
    @PreAuthorize("hasRole('CLIENT') or hasAuthority('CLIENT')")
    public ResponseEntity<ApiResponse<Void>> cancelInvitation(@PathVariable String id) {
        invitationService.cancelInvitation(id);
        return ResponseEntity.ok(ApiResponse.of(HttpStatus.OK.value(), "Hủy lời mời hợp tác thành công", null));
    }
}