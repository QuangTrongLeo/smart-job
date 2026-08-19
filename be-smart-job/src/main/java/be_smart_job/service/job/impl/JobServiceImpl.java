package be_smart_job.service.job.impl;

import be_smart_job.dto.req.job.JobRequest;
import be_smart_job.dto.res.job.JobResponse;
import be_smart_job.entity.Job;
import be_smart_job.mapper.job.JobMapper;
import be_smart_job.repository.job.CategoryRepository;
import be_smart_job.repository.job.JobRepository;
import be_smart_job.service.job.interfaces.JobService;
import be_smart_job.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class JobServiceImpl implements JobService {

    private final JobRepository jobRepository;
    private final CategoryRepository categoryRepository;
    private final JobMapper jobMapper;

    @Override
    public List<JobResponse> getAllJobs() {
        return jobRepository.findAll()
                .stream()
                .map(jobMapper::toResponse)
                .toList();
    }

    @Override
    public JobResponse getJobById(String id) {
        Job job = findById(id);
        return jobMapper.toResponse(job);
    }

    @Override
    public List<JobResponse> getMyJobs() {
        String currentUserId = SecurityUtils.getCurrentUserId();
        return jobRepository.findByClientId(currentUserId)
                .stream()
                .map(jobMapper::toResponse)
                .toList();
    }

    @Override
    public JobResponse createJob(JobRequest request) {
        validateCategoriesExist(request.getCategoryIds());

        String currentUserId = SecurityUtils.getCurrentUserId();
        Job job = jobMapper.toEntity(request);
        job.setClientId(currentUserId);

        Job savedJob = jobRepository.save(job);
        return jobMapper.toResponse(savedJob);
    }

    @Override
    public JobResponse updateJob(String id, JobRequest request) {
        Job job = findById(id);
        String currentUserId = SecurityUtils.getCurrentUserId();

        // Chỉ chính chủ Client mới được chỉnh sửa công việc
        if (!job.getClientId().equals(currentUserId)) {
            throw new AccessDeniedException("Bạn không có quyền chỉnh sửa bài đăng công việc này");
        }

        validateCategoriesExist(request.getCategoryIds());
        jobMapper.updateEntityFromRequest(request, job);

        Job updatedJob = jobRepository.save(job);
        return jobMapper.toResponse(updatedJob);
    }

    @Override
    public void deleteJob(String id) {
        Job job = findById(id);
        String currentUserId = SecurityUtils.getCurrentUserId();
        boolean isAdmin = SecurityUtils.hasRole("ADMIN");

        // ADMIN có thể xóa bất kỳ bài nào, CLIENT chỉ xóa được bài của chính mình
        if (!isAdmin && !job.getClientId().equals(currentUserId)) {
            throw new AccessDeniedException("Bạn không có quyền xóa bài đăng công việc này");
        }

        jobRepository.delete(job);
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