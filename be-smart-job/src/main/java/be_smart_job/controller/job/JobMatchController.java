package be_smart_job.controller.job;

import be_smart_job.dto.res.ApiResponse;
import be_smart_job.dto.res.job.JobMatchResponse;
import be_smart_job.service.job.interfaces.JobMatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/job-matches")
@RequiredArgsConstructor
public class JobMatchController {

    private final JobMatchService jobMatchService;

    // Cho phép xem công khai không cần đăng nhập
    @GetMapping
    public ResponseEntity<ApiResponse<JobMatchResponse>> getJobMatch(
            @RequestParam String jobId,
            @RequestParam String freelancerId) {

        JobMatchResponse response = jobMatchService.getMatchByJobAndFreelancer(jobId, freelancerId);
        return ResponseEntity.ok(
                ApiResponse.of(HttpStatus.OK.value(), "Lấy thông tin độ tương thích công việc thành công", response)
        );
    }
}