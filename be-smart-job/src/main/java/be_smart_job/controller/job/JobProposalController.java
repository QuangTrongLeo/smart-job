package be_smart_job.controller.job;

import be_smart_job.dto.req.job.JobProposalRequest;
import be_smart_job.dto.res.ApiResponse;
import be_smart_job.dto.res.job.JobProposalResponse;
import be_smart_job.enums.ProposalStatus;
import be_smart_job.service.job.interfaces.JobProposalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/jobs/proposals")
@RequiredArgsConstructor
public class JobProposalController {

    private final JobProposalService proposalService;

    // Freelancer nộp đề xuất hợp tác cho Job
    @PostMapping
    @PreAuthorize("hasRole('FREELANCER') or hasAuthority('FREELANCER')")
    public ResponseEntity<ApiResponse<JobProposalResponse>> createProposal(
            @Valid @RequestBody JobProposalRequest request) {
        JobProposalResponse response = proposalService.createProposal(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.of(HttpStatus.CREATED.value(), "Gửi đề xuất hợp tác thành công", response));
    }

    // Freelancer xem danh sách đề xuất mình đã gửi
    @GetMapping("/me")
    @PreAuthorize("hasRole('FREELANCER') or hasAuthority('FREELANCER')")
    public ResponseEntity<ApiResponse<List<JobProposalResponse>>> getMySentProposals() {
        List<JobProposalResponse> list = proposalService.getMySentProposals();
        return ResponseEntity.ok(ApiResponse.of(HttpStatus.OK.value(), "Lấy danh sách đề xuất thành công", list));
    }

    // Freelancer hủy/xóa đơn ứng tuyển
    @DeleteMapping("/{id}/cancel")
    @PreAuthorize("hasRole('FREELANCER') or hasAuthority('FREELANCER')")
    public ResponseEntity<ApiResponse<Void>> cancelProposal(@PathVariable String id) {
        proposalService.cancelProposal(id);
        return ResponseEntity.ok(ApiResponse.of(HttpStatus.OK.value(), "Xóa đơn ứng tuyển thành công", null));
    }

    // Client xem danh sách tất cả các ứng tuyển gửi tới cho mình
    @GetMapping("/client")
    @PreAuthorize("hasRole('CLIENT') or hasAuthority('CLIENT')")
    public ResponseEntity<ApiResponse<List<JobProposalResponse>>> getProposalsForClient() {
        List<JobProposalResponse> response = proposalService.getProposalsByClient();
        return ResponseEntity.ok(ApiResponse.of(HttpStatus.OK.value(), "Lấy danh sách ứng tuyển thành công", response));
    }

    // Client Phản hồi đề xuất (ACCEPTED hoặc REJECTED)
    @PatchMapping("/{id}/respond")
    @PreAuthorize("hasRole('CLIENT') or hasAuthority('CLIENT')")
    public ResponseEntity<ApiResponse<JobProposalResponse>> respondToProposal(
            @PathVariable String id,
            @RequestParam ProposalStatus status) {
        JobProposalResponse response = proposalService.respondToProposal(id, status);
        return ResponseEntity.ok(ApiResponse.of(HttpStatus.OK.value(), "Xử lý đề xuất thành công", response));
    }
}