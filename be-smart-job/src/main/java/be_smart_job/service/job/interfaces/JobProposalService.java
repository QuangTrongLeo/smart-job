package be_smart_job.service.job.interfaces;

import be_smart_job.dto.req.job.JobProposalRequest;
import be_smart_job.dto.res.job.JobProposalResponse;
import be_smart_job.enums.ProposalStatus;

import java.util.List;

public interface JobProposalService {

    // Freelancer nộp đề xuất hợp tác cho 1 Job
    JobProposalResponse createProposal(JobProposalRequest request);

    // Freelancer xem danh sách các đề xuất mình đã gửi
    List<JobProposalResponse> getMySentProposals();

    // Freelancer hủy đề xuất hợp tác
    void cancelProposal(String proposalId);

    // Client xem các đề xuất nhận được theo Job ID
    public List<JobProposalResponse> getProposalsByClient();

    // Client chấp nhận hoặc từ chối đề xuất
    JobProposalResponse respondToProposal(String proposalId, ProposalStatus status);
}