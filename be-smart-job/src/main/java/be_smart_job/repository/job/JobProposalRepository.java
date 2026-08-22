package be_smart_job.repository.job;

import be_smart_job.entity.JobProposal;
import be_smart_job.enums.ProposalStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobProposalRepository extends MongoRepository<JobProposal, String> {

    List<JobProposal> findByClientId(String clientId);

    // Lấy tất cả đề xuất do Freelancer đã nộp
    List<JobProposal> findByFreelancerUserIdOrderByCreatedAtDesc(String freelancerUserId);

    // Kiểm tra xem Freelancer đã nộp proposal cho Job này và đang ở trạng thái PENDING chưa
    boolean existsByFreelancerUserIdAndJobIdAndStatus(String freelancerUserId, String jobId, ProposalStatus status);
}