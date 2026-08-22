package be_smart_job.service.job.impl;

import be_smart_job.dto.req.job.JobProposalRequest;
import be_smart_job.dto.res.identity.UserResponse;
import be_smart_job.dto.res.job.FreelancerProfileResponse;
import be_smart_job.dto.res.job.JobProposalResponse;
import be_smart_job.dto.res.job.JobResponse;
import be_smart_job.entity.FreelancerProfile;
import be_smart_job.entity.Job;
import be_smart_job.entity.JobProposal;
import be_smart_job.entity.User;
import be_smart_job.enums.JobStatus;
import be_smart_job.enums.ProposalStatus;
import be_smart_job.mapper.identity.UserMapper;
import be_smart_job.mapper.job.JobMapper;
import be_smart_job.mapper.job.JobProposalMapper;
import be_smart_job.repository.identity.UserRepository;
import be_smart_job.repository.job.FreelancerProfileRepository;
import be_smart_job.repository.job.JobProposalRepository;
import be_smart_job.repository.job.JobRepository;
import be_smart_job.service.job.interfaces.FreelancerProfileService;
import be_smart_job.service.job.interfaces.JobProposalService;
import be_smart_job.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class JobProposalServiceImpl implements JobProposalService {

    private final JobProposalRepository proposalRepository;
    private final JobRepository jobRepository;
    private final FreelancerProfileRepository profileRepository;
    private final FreelancerProfileService profileService;
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final JobMapper jobMapper;
    private final JobProposalMapper proposalMapper;

    @Override
    public JobProposalResponse createProposal(JobProposalRequest request) {
        validateRole("FREELANCER", "Chỉ Freelancer mới có thể gửi yêu cầu ứng tuyển!");

        // 1. Chuẩn hóa ID của Freelancer đang đăng nhập
        String currentUserId = resolveUserId(SecurityUtils.getCurrentUserId());

        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy thông tin công việc!"));

        if (job.getStatus() != JobStatus.OPEN) {
            throw new IllegalArgumentException("Công việc này hiện không còn tiếp nhận thêm ứng tuyển!");
        }

        // 2. Chuẩn hóa ID khi tìm Freelancer Profile
        FreelancerProfile profile = profileRepository.findByUserId(currentUserId)
                .orElseGet(() -> profileRepository.findAll().stream()
                        .filter(p -> resolveUserId(p.getUserId()).equals(currentUserId))
                        .findFirst()
                        .orElseThrow(() -> new IllegalArgumentException("Bạn chưa tạo hồ sơ Freelancer, vui lòng tạo hồ sơ trước!")));

        boolean existsPending = proposalRepository.existsByFreelancerUserIdAndJobIdAndStatus(
                currentUserId, request.getJobId(), ProposalStatus.PENDING
        );

        if (existsPending) {
            throw new IllegalArgumentException("Bạn đã gửi yêu cầu ứng tuyển cho công việc này rồi!");
        }

        // 3. Chuẩn hóa ID của Client sở hữu Bài đăng
        String jobClientId = resolveUserId(job.getClientId());

        JobProposal proposal = JobProposal.builder()
                .jobId(job.getId())
                .clientId(jobClientId)              // Luôn lưu ObjectId của Client
                .freelancerUserId(currentUserId)    // Luôn lưu ObjectId của Freelancer User
                .freelancerProfileId(profile.getId())// Lưu ID Profile
                .status(ProposalStatus.PENDING)
                .build();

        JobProposal saved = proposalRepository.save(proposal);
        return mapToResponse(saved);
    }

    @Override
    public List<JobProposalResponse> getMySentProposals() {
        validateRole("FREELANCER", "Chỉ Freelancer mới có quyền truy cập danh sách đã ứng tuyển!");
        String currentUserId = resolveUserId(SecurityUtils.getCurrentUserId());

        return proposalRepository.findByFreelancerUserIdOrderByCreatedAtDesc(currentUserId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public void cancelProposal(String proposalId) {
        validateRole("FREELANCER", "Chỉ Freelancer mới có quyền hủy ứng tuyển!");
        String currentUserId = resolveUserId(SecurityUtils.getCurrentUserId());

        JobProposal proposal = proposalRepository.findById(proposalId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy thông tin ứng tuyển!"));

        if (!resolveUserId(proposal.getFreelancerUserId()).equals(currentUserId)) {
            throw new AccessDeniedException("Bạn không có quyền hủy ứng tuyển này!");
        }

        // Xóa trực tiếp khỏi Database thay vì đổi status
        proposalRepository.delete(proposal);
    }

    @Override
    public List<JobProposalResponse> getProposalsByJob(String jobId, ProposalStatus status) {
        validateRole("CLIENT", "Chỉ Client sở hữu công việc mới có thể xem danh sách ứng tuyển!");
        String currentClientId = resolveUserId(SecurityUtils.getCurrentUserId());

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy công việc!"));

        if (!resolveUserId(job.getClientId()).equals(currentClientId)) {
            throw new AccessDeniedException("Bạn không phải chủ sở hữu công việc này!");
        }

        List<JobProposal> proposals = (status != null)
                ? proposalRepository.findByJobIdAndStatusOrderByCreatedAtDesc(jobId, status)
                : proposalRepository.findByJobIdOrderByCreatedAtDesc(jobId);

        return proposals.stream().map(this::mapToResponse).toList();
    }

    @Override
    public JobProposalResponse respondToProposal(String proposalId, ProposalStatus status) {
        validateRole("CLIENT", "Chỉ Client mới có quyền phản hồi ứng tuyển!");
        String currentClientId = resolveUserId(SecurityUtils.getCurrentUserId());

        JobProposal proposal = proposalRepository.findById(proposalId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy thông tin ứng tuyển!"));

        if (!resolveUserId(proposal.getClientId()).equals(currentClientId)) {
            throw new AccessDeniedException("Bạn không có quyền xử lý lượt ứng tuyển này!");
        }

        if (proposal.getStatus() != ProposalStatus.PENDING) {
            throw new IllegalArgumentException("Lượt ứng tuyển này đã được xử lý trước đó!");
        }

        if (status != ProposalStatus.ACCEPTED && status != ProposalStatus.REJECTED) {
            throw new IllegalArgumentException("Trạng thái không hợp lệ (Chỉ nhận ACCEPTED hoặc REJECTED)!");
        }

        proposal.setStatus(status);
        JobProposal updated = proposalRepository.save(proposal);

        return mapToResponse(updated);
    }

    private void validateRole(String role, String errorMessage) {
        if (!SecurityUtils.hasRole(role)) {
            throw new AccessDeniedException(errorMessage);
        }
    }

    private JobProposalResponse mapToResponse(JobProposal proposal) {
        // 1. Tìm thông tin Bài đăng Công việc (Job)
        Job job = jobRepository.findById(proposal.getJobId()).orElse(null);
        JobResponse jobResponse = job != null ? jobMapper.toResponse(job) : null;

        // 2. Tìm thông tin Client (Chủ sở hữu Job)
        User clientUser = null;
        if (proposal.getClientId() != null) {
            try {
                String clientUserId = resolveUserId(proposal.getClientId());
                clientUser = userRepository.findById(clientUserId).orElse(null);
            } catch (Exception e) {
                log.warn("[PROPOSAL] Không tìm thấy Client User cho Proposal ID: {}, Raw ClientId: {}",
                        proposal.getId(), proposal.getClientId());
            }
        }
        UserResponse clientResponse = clientUser != null ? userMapper.toResponse(clientUser) : null;

        // 3. Tìm thông tin User của Freelancer
        User freelancerUser = null;
        if (proposal.getFreelancerUserId() != null) {
            try {
                String freelancerUserId = resolveUserId(proposal.getFreelancerUserId());
                freelancerUser = userRepository.findById(freelancerUserId).orElse(null);
            } catch (Exception e) {
                log.warn("[PROPOSAL] Không tìm thấy Freelancer User cho Proposal ID: {}, Raw FreelancerUserId: {}",
                        proposal.getId(), proposal.getFreelancerUserId());
            }
        }
        UserResponse freelancerResponse = freelancerUser != null ? userMapper.toResponse(freelancerUser) : null;

        // 4. Tìm thông tin Hồ sơ Freelancer Profile
        FreelancerProfileResponse profileResponse = profileService.getProfileById(proposal.getFreelancerProfileId());

        // 5. Ánh xạ đủ 4 trường đối tượng vào Response
        return proposalMapper.toResponse(
                proposal,
                jobResponse,
                clientResponse,
                freelancerResponse,
                profileResponse
        );
    }

    /**
     * Hàm helper chuyển đổi Identifier (Email/Username/ObjectId) về đúng ObjectId của User.id
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