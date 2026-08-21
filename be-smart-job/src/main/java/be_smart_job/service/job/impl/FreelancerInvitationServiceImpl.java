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
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
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

        // Chuyển đổi chính xác Identifier thu được từ Token về User ID (ObjectId)
        String currentClientId = resolveUserId(SecurityUtils.getCurrentUserId());

        FreelancerProfile profile = profileRepository.findById(request.getFreelancerProfileId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy hồ sơ Freelancer!"));

        // Đảm bảo freelancerUserId cũng là User ID (ObjectId)
        String freelancerUserId = resolveUserId(profile.getUserId());

        if (currentClientId.equals(freelancerUserId)) {
            throw new IllegalArgumentException("Bạn không thể tự gửi lời mời hợp tác cho chính mình!");
        }

        boolean hasPending = invitationRepository.existsByClientIdAndFreelancerProfileIdAndStatus(
                currentClientId, request.getFreelancerProfileId(), InvitationStatus.PENDING
        );

        if (hasPending) {
            throw new IllegalArgumentException("Bạn đã gửi lời mời hợp tác cho Freelancer này rồi, vui lòng chờ phản hồi!");
        }

        FreelancerInvitation invitation = FreelancerInvitation.builder()
                .clientId(currentClientId)           // Lưu ObjectId của Client User
                .freelancerProfileId(profile.getId()) // Lưu ObjectId của Freelancer Profile
                .freelancerUserId(freelancerUserId)   // Lưu ObjectId của Freelancer User
                .status(InvitationStatus.PENDING)
                .build();

        FreelancerInvitation saved = invitationRepository.save(invitation);
        return mapToResponse(saved);
    }

    @Override
    public List<FreelancerInvitationResponse> getSentInvitations() {
        validateRole("CLIENT", "Chỉ Client mới có quyền xem danh sách lời mời đã gửi!");
        String currentClientId = resolveUserId(SecurityUtils.getCurrentUserId());

        return invitationRepository.findByClientIdOrderByCreatedAtDesc(currentClientId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<FreelancerInvitationResponse> getReceivedInvitations(InvitationStatus status) {
        validateRole("FREELANCER", "Chỉ Freelancer mới có quyền xem danh sách lời mời hợp tác!");
        String currentFreelancerUserId = resolveUserId(SecurityUtils.getCurrentUserId());

        List<FreelancerInvitation> list = (status != null)
                ? invitationRepository.findByFreelancerUserIdAndStatusOrderByCreatedAtDesc(currentFreelancerUserId, status)
                : invitationRepository.findByFreelancerUserIdOrderByCreatedAtDesc(currentFreelancerUserId);

        return list.stream().map(this::mapToResponse).toList();
    }

    @Override
    public FreelancerInvitationResponse respondToInvitation(String invitationId, InvitationStatus status) {
        validateRole("FREELANCER", "Chỉ Freelancer mới có quyền phản hồi lời mời hợp tác!");
        String currentFreelancerUserId = resolveUserId(SecurityUtils.getCurrentUserId());

        FreelancerInvitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy thông tin lời mời!"));

        if (!resolveUserId(invitation.getFreelancerUserId()).equals(currentFreelancerUserId)) {
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
        String currentClientId = resolveUserId(SecurityUtils.getCurrentUserId());

        FreelancerInvitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy lời mời hợp tác!"));

        if (!resolveUserId(invitation.getClientId()).equals(currentClientId)) {
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
        User clientUser = null;

        if (invitation.getClientId() != null) {
            // Sử dụng resolveUserId để tìm được UserEntity kể cả dữ liệu cũ trong DB lỡ lưu Email/Username
            try {
                String clientUserId = resolveUserId(invitation.getClientId());
                clientUser = userRepository.findById(clientUserId).orElse(null);
            } catch (Exception e) {
                log.warn("[INVITATION] Không thể resolve Client ID cho invitation ID: {}", invitation.getId());
            }
        }

        UserResponse clientResponse = clientUser != null ? userMapper.toResponse(clientUser) : null;
        FreelancerProfileResponse profileResponse = profileService.getProfileById(invitation.getFreelancerProfileId());

        return invitationMapper.toResponse(invitation, clientResponse, profileResponse);
    }

    /**
     * Chuyển đổi định dạng identifier (Email/Username/ObjectId) về chính xác User.id (ObjectId)
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
                                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người dùng: " + identifier))));
    }
}