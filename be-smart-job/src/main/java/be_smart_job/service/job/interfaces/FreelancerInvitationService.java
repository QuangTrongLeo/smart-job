package be_smart_job.service.job.interfaces;

import be_smart_job.dto.req.job.FreelancerInvitationRequest;
import be_smart_job.dto.res.job.FreelancerInvitationResponse;
import be_smart_job.enums.InvitationStatus;

import java.util.List;

public interface FreelancerInvitationService {

    // Client bấm nút gửi lời mời hợp tác
    FreelancerInvitationResponse sendInvitation(FreelancerInvitationRequest request);

    // Client xem danh sách lời mời đã gửi
    List<FreelancerInvitationResponse> getSentInvitations();

    // Freelancer xem danh sách lời mời nhận được
    List<FreelancerInvitationResponse> getReceivedInvitations(InvitationStatus status);

    // Freelancer Chấp nhận/Từ chối lời mời
    FreelancerInvitationResponse respondToInvitation(String invitationId, InvitationStatus status);

    // Client Hủy lời mời
    void cancelInvitation(String invitationId);
}