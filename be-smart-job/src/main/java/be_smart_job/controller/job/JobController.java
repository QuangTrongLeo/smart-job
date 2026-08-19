package be_smart_job.controller.job;

import be_smart_job.dto.req.job.JobRequest;
import be_smart_job.dto.res.ApiResponse;
import be_smart_job.dto.res.job.JobResponse;
import be_smart_job.service.job.interfaces.JobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    // Xem danh sách công việc (Public)
    @GetMapping
    public ResponseEntity<ApiResponse<List<JobResponse>>> getAllJobs() {
        List<JobResponse> jobs = jobService.getAllJobs();
        return ResponseEntity.ok(ApiResponse.of(HttpStatus.OK.value(), "Lấy danh sách công việc thành công", jobs));
    }

    // Xem chi tiết công việc (Public)
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<JobResponse>> getJobById(@PathVariable String id) {
        JobResponse job = jobService.getJobById(id);
        return ResponseEntity.ok(ApiResponse.of(HttpStatus.OK.value(), "Lấy thông tin công việc thành công", job));
    }

    // Lấy danh sách bài đăng của Client đang đăng nhập
    @GetMapping("/my-jobs")
    @PreAuthorize("hasRole('CLIENT') or hasAuthority('CLIENT')")
    public ResponseEntity<ApiResponse<List<JobResponse>>> getMyJobs() {
        List<JobResponse> jobs = jobService.getMyJobs();
        return ResponseEntity.ok(ApiResponse.of(HttpStatus.OK.value(), "Lấy danh sách bài đăng của bạn thành công", jobs));
    }

    // Tạo công việc mới (Chỉ CLIENT)
    @PostMapping
    @PreAuthorize("hasRole('CLIENT') or hasAuthority('CLIENT')")
    public ResponseEntity<ApiResponse<JobResponse>> createJob(@Valid @RequestBody JobRequest request) {
        JobResponse job = jobService.createJob(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.of(HttpStatus.CREATED.value(), "Tạo bài đăng công việc thành công", job));
    }

    // Cập nhật công việc (Chỉ CLIENT sở hữu bài đăng)
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('CLIENT') or hasAuthority('CLIENT')")
    public ResponseEntity<ApiResponse<JobResponse>> updateJob(
            @PathVariable String id,
            @Valid @RequestBody JobRequest request) {
        JobResponse job = jobService.updateJob(id, request);
        return ResponseEntity.ok(ApiResponse.of(HttpStatus.OK.value(), "Cập nhật bài đăng công việc thành công", job));
    }

    // Xóa công việc (CLIENT sở hữu bài đăng HOẶC ADMIN)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('CLIENT') or hasAuthority('CLIENT') or hasRole('ADMIN') or hasAuthority('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteJob(@PathVariable String id) {
        jobService.deleteJob(id);
        return ResponseEntity.ok(ApiResponse.of(HttpStatus.OK.value(), "Xóa bài đăng công việc thành công", null));
    }
}