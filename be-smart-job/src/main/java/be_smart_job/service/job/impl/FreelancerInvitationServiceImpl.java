package be_smart_job.service.job.impl;

import be_smart_job.dto.req.job.FreelancerInvitationRequest;
import be_smart_job.dto.res.identity.UserResponse;
import be_smart_job.dto.res.job.FreelancerInvitationResponse;
import be_smart_job.dto.res.job.FreelancerProfileResponse;
import be_smart_job.entity.FreelancerInvitation;
import be_smart_job.entity.FreelancerProfile;
import be_smart_job.entity.User;
import be_smart_job.enums.InvitationStatus;
import be_smart_job.mapper.identity.UserMapper;
import be_smart_job.mapper.job.FreelancerInvitationMapper;
import be_smart_job.repository.identity.UserRepository;
import be_smart_job.repository.job.FreelancerInvitationRepository;
import be_smart_job.repository.job.FreelancerProfileRepository;
import be_smart_job.service.job.interfaces.FreelancerInvitationService;
import be_smart_job.service.job.interfaces.FreelancerProfileService;
import be_smart_job.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FreelancerInvitationServiceImpl implements FreelancerInvitationService {

    private final FreelancerInvitationRepository invitationRepository;
    private final FreelancerProfileRepository profileRepository;
    private final FreelancerProfileService profileService;
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final FreelancerInvitationMapper invitationMapper;

    @Override
    public FreelancerInvitationResponse sendInvitation(FreelancerInvitationRequest request) {
        validateRole("CLIENT", "Chỉ nhà tuyển dụng (Client) mới có thể gửi lời mời hợp tác!");

        String currentClientId = SecurityUtils.getCurrentUserId();

        FreelancerProfile profile = profileRepository.findById(request.getFreelancerProfileId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy hồ sơ Freelancer!"));

        if (currentClientId.equals(profile.getUserId())) {
            throw new IllegalArgumentException("Bạn không thể tự gửi lời mời hợp tác cho chính mình!");
        }

        boolean hasPending = invitationRepository.existsByClientIdAndFreelancerProfileIdAndStatus(
                currentClientId, request.getFreelancerProfileId(), InvitationStatus.PENDING
        );

        if (hasPending) {
            throw new IllegalArgumentException("Bạn đã gửi lời mời hợp tác cho Freelancer này rồi, vui lòng chờ phản hồi!");
        }

        FreelancerInvitation invitation = FreelancerInvitation.builder()
                .clientId(currentClientId)
                .freelancerProfileId(profile.getId())
                .freelancerUserId(profile.getUserId())
                .status(InvitationStatus.PENDING)
                .build();

        FreelancerInvitation saved = invitationRepository.save(invitation);
        return mapToResponse(saved);
    }

    @Override
    public List<FreelancerInvitationResponse> getSentInvitations() {
        validateRole("CLIENT", "Chỉ Client mới có quyền xem danh sách lời mời đã gửi!");
        String currentClientId = SecurityUtils.getCurrentUserId();

        return invitationRepository.findByClientIdOrderByCreatedAtDesc(currentClientId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<FreelancerInvitationResponse> getReceivedInvitations(InvitationStatus status) {
        validateRole("FREELANCER", "Chỉ Freelancer mới có quyền xem danh sách lời mời hợp tác!");
        String currentFreelancerUserId = SecurityUtils.getCurrentUserId();

        List<FreelancerInvitation> list = (status != null)
                ? invitationRepository.findByFreelancerUserIdAndStatusOrderByCreatedAtDesc(currentFreelancerUserId, status)
                : invitationRepository.findByFreelancerUserIdOrderByCreatedAtDesc(currentFreelancerUserId);

        return list.stream().map(this::mapToResponse).toList();
    }

    @Override
    public FreelancerInvitationResponse respondToInvitation(String invitationId, InvitationStatus status) {
        validateRole("FREELANCER", "Chỉ Freelancer mới có quyền phản hồi lời mời hợp tác!");
        String currentFreelancerUserId = SecurityUtils.getCurrentUserId();

        FreelancerInvitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy thông tin lời mời!"));

        if (!invitation.getFreelancerUserId().equals(currentFreelancerUserId)) {
            throw new AccessDeniedException("Bạn không có quyền phản hồi lời mời hợp tác này!");
        }

        if (invitation.getStatus() != InvitationStatus.PENDING) {
            throw new IllegalArgumentException("Lời mời hợp tác này đã được xử lý trước đó!");
        }

        if (status != InvitationStatus.ACCEPTED && status != InvitationStatus.REJECTED) {
            throw new IllegalArgumentException("Trạng thái phản hồi không hợp lệ (Chỉ chấp nhận ACCEPTED hoặc REJECTED)!");
        }

        invitation.setStatus(status);
        FreelancerInvitation updated = invitationRepository.save(invitation);

        return mapToResponse(updated);
    }

    @Override
    public void cancelInvitation(String invitationId) {
        validateRole("CLIENT", "Chỉ Client mới có quyền hủy lời mời hợp tác!");
        String currentClientId = SecurityUtils.getCurrentUserId();

        FreelancerInvitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy lời mời hợp tác!"));

        if (!invitation.getClientId().equals(currentClientId)) {
            throw new AccessDeniedException("Bạn không có quyền hủy lời mời này!");
        }

        invitation.setStatus(InvitationStatus.CANCELLED);
        invitationRepository.save(invitation);
    }

    private void validateRole(String role, String errorMessage) {
        if (!SecurityUtils.hasRole(role)) {
            throw new AccessDeniedException(errorMessage);
        }
    }

    private FreelancerInvitationResponse mapToResponse(FreelancerInvitation invitation) {
        User clientUser = userRepository.findById(invitation.getClientId()).orElse(null);
        UserResponse clientResponse = clientUser != null ? userMapper.toResponse(clientUser) : null;
        FreelancerProfileResponse profileResponse = profileService.getProfileById(invitation.getFreelancerProfileId());

        return invitationMapper.toResponse(invitation, clientResponse, profileResponse);
    }
}