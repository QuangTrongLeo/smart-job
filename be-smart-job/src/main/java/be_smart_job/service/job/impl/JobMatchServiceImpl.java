package be_smart_job.service.job.impl;

import be_smart_job.dto.res.identity.UserResponse;
import be_smart_job.dto.res.job.JobMatchResponse;
import be_smart_job.dto.res.job.JobResponse;
import be_smart_job.entity.Job;
import be_smart_job.entity.JobMatch;
import be_smart_job.entity.User;
import be_smart_job.mapper.identity.UserMapper;
import be_smart_job.mapper.job.JobMapper;
import be_smart_job.mapper.job.JobMatchMapper;
import be_smart_job.repository.identity.UserRepository;
import be_smart_job.repository.job.JobMatchRepository;
import be_smart_job.repository.job.JobRepository;
import be_smart_job.service.job.interfaces.JobMatchService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service("jobJobMatchServiceImpl")
@RequiredArgsConstructor
public class JobMatchServiceImpl implements JobMatchService {

    private final JobMatchRepository jobMatchRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    private final JobMapper jobMapper;
    private final UserMapper userMapper;
    private final JobMatchMapper jobMatchMapper;

    @Override
    public JobMatchResponse getMatchByJobAndFreelancer(String jobId, String freelancerId) {
        // 1. Chuẩn hóa ID của Freelancer
        String resolvedFreelancerId = resolveUserId(freelancerId);

        // 2. Tìm thông tin JobMatch trong MongoDB
        JobMatch match = jobMatchRepository.findByJobIdAndFreelancerId(jobId, resolvedFreelancerId)
                .orElseThrow(() -> new IllegalArgumentException(
                        String.format("Không tìm thấy thông tin phù hợp cho Công việc [ID: %s] và Freelancer [ID: %s]", jobId, freelancerId)
                ));

        // 3. Lấy thông tin Job
        Job job = jobRepository.findById(jobId).orElse(null);
        JobResponse jobResponse = job != null ? jobMapper.toResponse(job) : null;

        // 4. Lấy thông tin Freelancer User
        User freelancerUser = userRepository.findById(resolvedFreelancerId).orElse(null);
        UserResponse freelancerResponse = freelancerUser != null ? userMapper.toResponse(freelancerUser) : null;

        // 5. Ánh xạ trả về Response DTO
        return jobMatchMapper.toResponse(match, jobResponse, freelancerResponse);
    }

    /**
     * Helper chuyển đổi Username / Email / ID về đúng ObjectId của User.id
     */
    private String resolveUserId(String identifier) {
        if (identifier == null || identifier.isBlank()) {
            throw new IllegalArgumentException("Identifier người dùng không được để trống");
        }

        return userRepository.findById(identifier)
                .map(User::getId)
                .orElseGet(() -> userRepository.findByEmail(identifier)
                        .map(User::getId)
                        .orElseGet(() -> userRepository.findByUsername(identifier)
                                .map(User::getId)
                                .orElse(identifier)));
    }
}