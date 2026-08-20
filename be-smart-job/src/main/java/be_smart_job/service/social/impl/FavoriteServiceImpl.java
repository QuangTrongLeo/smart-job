package be_smart_job.service.social.impl;

import be_smart_job.dto.res.job.FreelancerProfileResponse;
import be_smart_job.dto.res.job.JobResponse;
import be_smart_job.dto.res.social.FavoriteFreelancerResponse;
import be_smart_job.dto.res.social.FavoriteJobResponse;
import be_smart_job.entity.FavoriteFreelancer;
import be_smart_job.entity.FavoriteJob;
import be_smart_job.mapper.social.FavoriteFreelancerMapper;
import be_smart_job.mapper.social.FavoriteJobMapper;
import be_smart_job.repository.job.FreelancerProfileRepository;
import be_smart_job.repository.job.JobRepository;
import be_smart_job.repository.social.FavoriteFreelancerRepository;
import be_smart_job.repository.social.FavoriteJobRepository;
import be_smart_job.service.job.interfaces.FreelancerProfileService;
import be_smart_job.service.job.interfaces.JobService;
import be_smart_job.service.social.interfaces.FavoriteService;
import be_smart_job.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FavoriteServiceImpl implements FavoriteService {

    private final FavoriteJobRepository favoriteJobRepository;
    private final FavoriteFreelancerRepository favoriteFreelancerRepository;
    private final JobRepository jobRepository;
    private final FreelancerProfileRepository profileRepository;

    private final JobService jobService;
    private final FreelancerProfileService profileService;

    private final FavoriteJobMapper favoriteJobMapper;
    private final FavoriteFreelancerMapper favoriteFreelancerMapper;

    // --- FREELANCER ACTIONS ---

    @Override
    public boolean toggleFavoriteJob(String jobId) {
        validateRole("FREELANCER", "Chỉ Freelancer mới có thể lưu công việc yêu thích");
        String freelancerId = SecurityUtils.getCurrentUserId();

        if (!jobRepository.existsById(jobId)) {
            throw new IllegalArgumentException("Không tìm thấy công việc với ID: " + jobId);
        }

        Optional<FavoriteJob> existingFavorite = favoriteJobRepository.findByFreelancerIdAndJobId(freelancerId, jobId);
        if (existingFavorite.isPresent()) {
            favoriteJobRepository.delete(existingFavorite.get());
            return false;
        } else {
            FavoriteJob favoriteJob = FavoriteJob.builder()
                    .freelancerId(freelancerId)
                    .jobId(jobId)
                    .build();
            favoriteJobRepository.save(favoriteJob);
            return true;
        }
    }

    @Override
    public List<FavoriteJobResponse> getMyFavoriteJobs() {
        validateRole("FREELANCER", "Chỉ Freelancer mới có danh sách công việc yêu thích");
        String freelancerId = SecurityUtils.getCurrentUserId();

        return favoriteJobRepository.findByFreelancerId(freelancerId)
                .stream()
                .map(fav -> {
                    JobResponse jobResponse = jobService.getJobById(fav.getJobId());
                    return favoriteJobMapper.toResponse(fav, jobResponse);
                })
                .toList();
    }

    // --- CLIENT ACTIONS ---

    @Override
    public boolean toggleFavoriteFreelancer(String freelancerProfileId) {
        validateRole("CLIENT", "Chỉ Nhà tuyển dụng (Client) mới có thể lưu hồ sơ Freelancer");
        String clientId = SecurityUtils.getCurrentUserId();

        // Kiểm tra tồn tại theo ID của hồ sơ Freelancer
        if (!profileRepository.existsById(freelancerProfileId)) {
            throw new IllegalArgumentException("Không tìm thấy hồ sơ Freelancer với ID: " + freelancerProfileId);
        }

        Optional<FavoriteFreelancer> existingFavorite = favoriteFreelancerRepository.findByClientIdAndFreelancerId(clientId, freelancerProfileId);
        if (existingFavorite.isPresent()) {
            favoriteFreelancerRepository.delete(existingFavorite.get());
            return false;
        } else {
            FavoriteFreelancer favorite = FavoriteFreelancer.builder()
                    .clientId(clientId)
                    .freelancerId(freelancerProfileId)
                    .build();
            favoriteFreelancerRepository.save(favorite);
            return true;
        }
    }

    @Override
    public List<FavoriteFreelancerResponse> getMyFavoriteFreelancers() {
        validateRole("CLIENT", "Chỉ Nhà tuyển dụng (Client) mới có danh sách Freelancer yêu thích");
        String clientId = SecurityUtils.getCurrentUserId();

        return favoriteFreelancerRepository.findByClientId(clientId)
                .stream()
                .map(fav -> {
                    // Đã sửa: Gọi getProfileById thay vì getProfileByUserId
                    FreelancerProfileResponse profileResponse = profileService.getProfileById(fav.getFreelancerId());
                    return favoriteFreelancerMapper.toResponse(fav, profileResponse);
                })
                .toList();
    }

    private void validateRole(String role, String errorMessage) {
        if (!SecurityUtils.hasRole(role)) {
            throw new AccessDeniedException(errorMessage);
        }
    }
}