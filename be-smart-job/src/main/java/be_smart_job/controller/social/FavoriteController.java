package be_smart_job.controller.social;

import be_smart_job.dto.res.ApiResponse;
import be_smart_job.dto.res.social.FavoriteFreelancerResponse;
import be_smart_job.dto.res.social.FavoriteJobResponse;
import be_smart_job.service.social.interfaces.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    // --- CÔNG VIỆC YÊU THÍCH (FREELANCER) ---

    @PostMapping("/jobs/{jobId}")
    @PreAuthorize("hasRole('FREELANCER') or hasAuthority('FREELANCER')")
    public ResponseEntity<ApiResponse<Boolean>> toggleFavoriteJob(@PathVariable String jobId) {
        boolean isFavorited = favoriteService.toggleFavoriteJob(jobId);
        String message = isFavorited ? "Đã thêm công việc vào danh sách yêu thích" : "Đã xóa công việc khỏi danh sách yêu thích";
        return ResponseEntity.ok(ApiResponse.of(HttpStatus.OK.value(), message, isFavorited));
    }

    @GetMapping("/jobs")
    @PreAuthorize("hasRole('FREELANCER') or hasAuthority('FREELANCER')")
    public ResponseEntity<ApiResponse<List<FavoriteJobResponse>>> getMyFavoriteJobs() {
        List<FavoriteJobResponse> jobs = favoriteService.getMyFavoriteJobs();
        return ResponseEntity.ok(ApiResponse.of(HttpStatus.OK.value(), "Lấy danh sách công việc đã lưu thành công", jobs));
    }

    // --- FREELANCER YÊU THÍCH (CLIENT) ---

    @PostMapping("/freelancers/{freelancerUserId}")
    @PreAuthorize("hasRole('CLIENT') or hasAuthority('CLIENT')")
    public ResponseEntity<ApiResponse<Boolean>> toggleFavoriteFreelancer(@PathVariable String freelancerUserId) {
        boolean isFavorited = favoriteService.toggleFavoriteFreelancer(freelancerUserId);
        String message = isFavorited ? "Đã lưu Freelancer vào danh sách yêu thích" : "Đã xóa Freelancer khỏi danh sách yêu thích";
        return ResponseEntity.ok(ApiResponse.of(HttpStatus.OK.value(), message, isFavorited));
    }

    @GetMapping("/freelancers")
    @PreAuthorize("hasRole('CLIENT') or hasAuthority('CLIENT')")
    public ResponseEntity<ApiResponse<List<FavoriteFreelancerResponse>>> getMyFavoriteFreelancers() {
        List<FavoriteFreelancerResponse> freelancers = favoriteService.getMyFavoriteFreelancers();
        return ResponseEntity.ok(ApiResponse.of(HttpStatus.OK.value(), "Lấy danh sách Freelancer đã lưu thành công", freelancers));
    }
}