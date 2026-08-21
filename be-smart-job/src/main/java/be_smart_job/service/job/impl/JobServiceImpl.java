package be_smart_job.service.job.impl;

import be_smart_job.dto.req.job.JobRequest;
import be_smart_job.dto.res.identity.UserResponse;
import be_smart_job.dto.res.job.CategoryResponse;
import be_smart_job.dto.res.job.JobResponse;
import be_smart_job.entity.Job;
import be_smart_job.entity.User;
import be_smart_job.mapper.identity.UserMapper;
import be_smart_job.mapper.job.CategoryMapper;
import be_smart_job.mapper.job.JobMapper;
import be_smart_job.repository.identity.UserRepository;
import be_smart_job.repository.job.CategoryRepository;
import be_smart_job.repository.job.JobRepository;
import be_smart_job.service.job.interfaces.JobService;
import be_smart_job.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class JobServiceImpl implements JobService {

    private final JobRepository jobRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final JobMapper jobMapper;
    private final UserMapper userMapper;
    private final CategoryMapper categoryMapper;

    @Override
    public List<JobResponse> getAllJobs() {
        return jobRepository.findAll()
                .stream()
                .map(this::enrichJobResponse)
                .toList();
    }

    @Override
    public JobResponse getJobById(String id) {
        Job job = findById(id);
        return enrichJobResponse(job);
    }

    @Override
    public List<JobResponse> getMyJobs() {
        String currentUserId = SecurityUtils.getCurrentUserId();

        // Đảm bảo lấy danh sách job của user cho dù DB lưu clientId là ID hay Email
        List<Job> jobs = jobRepository.findByClientId(currentUserId);
        if (jobs.isEmpty()) {
            userRepository.findById(currentUserId).ifPresent(user -> {
                if (user.getEmail() != null) {
                    jobs.addAll(jobRepository.findByClientId(user.getEmail()));
                }
            });
        }

        return jobs.stream()
                .map(this::enrichJobResponse)
                .toList();
    }

    @Override
    public JobResponse createJob(JobRequest request) {
        validateCategoriesExist(request.getCategoryIds());

        String currentUserId = SecurityUtils.getCurrentUserId();

        // Đảm bảo lấy đúng ID người dùng nếu SecurityUtils trả về Username/Email
        User currentUser = userRepository.findById(currentUserId)
                .orElseGet(() -> userRepository.findByEmail(currentUserId)
                        .orElseGet(() -> userRepository.findByUsername(currentUserId)
                                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy thông tin người tạo công việc"))));

        Job job = jobMapper.toEntity(request);
        job.setClientId(currentUser.getId()); // Ép buộc lưu bằng User ID chính xác

        Job savedJob = jobRepository.save(job);
        return enrichJobResponse(savedJob);
    }

    @Override
    public JobResponse updateJob(String id, JobRequest request) {
        Job job = findById(id);
        String currentUserId = SecurityUtils.getCurrentUserId();

        User currentUser = userRepository.findById(currentUserId)
                .orElseGet(() -> userRepository.findByEmail(currentUserId)
                        .orElseGet(() -> userRepository.findByUsername(currentUserId).orElse(null)));

        String currentId = currentUser != null ? currentUser.getId() : currentUserId;
        String currentEmail = currentUser != null ? currentUser.getEmail() : "";

        if (!job.getClientId().equals(currentId) && !job.getClientId().equals(currentEmail)) {
            throw new AccessDeniedException("Bạn không có quyền chỉnh sửa bài đăng công việc này");
        }

        validateCategoriesExist(request.getCategoryIds());
        jobMapper.updateEntityFromRequest(request, job);

        // Chuẩn hóa clientId về User ID nếu bản ghi cũ vẫn dùng Email
        job.setClientId(currentId);

        Job updatedJob = jobRepository.save(job);
        return enrichJobResponse(updatedJob);
    }

    @Override
    public void deleteJob(String id) {
        Job job = findById(id);
        String currentUserId = SecurityUtils.getCurrentUserId();
        boolean isAdmin = SecurityUtils.hasRole("ADMIN");

        User currentUser = userRepository.findById(currentUserId)
                .orElseGet(() -> userRepository.findByEmail(currentUserId)
                        .orElseGet(() -> userRepository.findByUsername(currentUserId).orElse(null)));

        String currentId = currentUser != null ? currentUser.getId() : currentUserId;
        String currentEmail = currentUser != null ? currentUser.getEmail() : "";

        if (!isAdmin && !job.getClientId().equals(currentId) && !job.getClientId().equals(currentEmail)) {
            throw new AccessDeniedException("Bạn không có quyền xóa bài đăng công việc này");
        }

        jobRepository.delete(job);
    }

    /**
     * Hàm bổ sung đầy đủ dữ liệu Client, Categories, createdAt, updatedAt vào JobResponse
     */
    private JobResponse enrichJobResponse(Job job) {
        JobResponse response = jobMapper.toResponse(job);

        // Map thời gian từ BaseEntity
        if (job.getCreatedAt() != null) {
            response.setCreatedAt(job.getCreatedAt());
        }
        if (job.getUpdatedAt() != null) {
            response.setUpdatedAt(job.getUpdatedAt());
        }

        // 1. Enrich thông tin Client (Hỗ trợ tìm kiếm theo cả ID lẫn Email/Username)
        if (job.getClientId() != null && !job.getClientId().trim().isEmpty()) {
            Optional<User> userOpt = userRepository.findById(job.getClientId());

            // Fallback: Nếu không tìm thấy bằng ID, tiếp tục tìm theo Email hoặc Username
            if (userOpt.isEmpty()) {
                userOpt = userRepository.findByEmail(job.getClientId());
            }
            if (userOpt.isEmpty()) {
                userOpt = userRepository.findByUsername(job.getClientId());
            }

            if (userOpt.isPresent()) {
                response.setClient(userMapper.toResponse(userOpt.get()));
            } else {
                log.warn("Không tìm thấy User trong DB với clientId/email: {}", job.getClientId());
            }
        } else {
            log.warn("Job id = {} có clientId bị NULL hoặc rỗng trong DB!", job.getId());
        }

        // 2. Enrich danh sách Categories
        if (job.getCategoryIds() != null && !job.getCategoryIds().isEmpty()) {
            List<CategoryResponse> categories = categoryRepository.findAllById(job.getCategoryIds())
                    .stream()
                    .map(categoryMapper::toResponse)
                    .toList();
            response.setCategories(categories);
        } else {
            response.setCategories(Collections.emptyList());
        }

        return response;
    }

    private Job findById(String id) {
        return jobRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy bài đăng công việc với ID: " + id));
    }

    private void validateCategoriesExist(List<String> categoryIds) {
        if (categoryIds == null || categoryIds.isEmpty()) {
            throw new IllegalArgumentException("Danh sách danh mục không được để trống");
        }

        for (String categoryId : categoryIds) {
            if (!categoryRepository.existsById(categoryId)) {
                throw new IllegalArgumentException("Không tìm thấy danh mục với ID: " + categoryId);
            }
        }
    }
}