package be_smart_job.repository.job;

import be_smart_job.entity.JobProposal;
import be_smart_job.enums.ProposalStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobProposalRepository extends MongoRepository<JobProposal, String> {

    // Lấy tất cả đề xuất do Freelancer đã nộp
    List<JobProposal> findByFreelancerUserIdOrderByCreatedAtDesc(String freelancerUserId);

    // Lấy đề xuất theo Job (Dành cho Client quản lý bài đăng)
    List<JobProposal> findByJobIdOrderByCreatedAtDesc(String jobId);

    // Lấy đề xuất theo Job và Trạng thái
    List<JobProposal> findByJobIdAndStatusOrderByCreatedAtDesc(String jobId, ProposalStatus status);

    // Lấy danh sách đề xuất gửi tới các Job của Client
    List<JobProposal> findByClientIdOrderByCreatedAtDesc(String clientId);

    // Kiểm tra xem Freelancer đã nộp proposal cho Job này và đang ở trạng thái PENDING chưa
    boolean existsByFreelancerUserIdAndJobIdAndStatus(String freelancerUserId, String jobId, ProposalStatus status);
}