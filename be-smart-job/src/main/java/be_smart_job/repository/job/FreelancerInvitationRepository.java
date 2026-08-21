package be_smart_job.repository.job;

import be_smart_job.entity.FreelancerInvitation;
import be_smart_job.enums.InvitationStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FreelancerInvitationRepository extends MongoRepository<FreelancerInvitation, String> {

    // Danh sách lời mời Freelancer nhận được
    List<FreelancerInvitation> findByFreelancerUserIdOrderByCreatedAtDesc(String freelancerUserId);

    // Danh sách lời mời Freelancer nhận được theo trạng thái (VD: PENDING)
    List<FreelancerInvitation> findByFreelancerUserIdAndStatusOrderByCreatedAtDesc(String freelancerUserId, InvitationStatus status);

    // Danh sách lời mời Client đã gửi
    List<FreelancerInvitation> findByClientIdOrderByCreatedAtDesc(String clientId);

    // Kiểm tra xem Client đã gửi lời mời đến Hồ sơ này và đang PENDING chưa
    boolean existsByClientIdAndFreelancerProfileIdAndStatus(String clientId, String freelancerProfileId, InvitationStatus status);

    // Kiểm tra xem đã tồn tại lời mời giữa Client và Freelancer profile này chưa
    Optional<FreelancerInvitation> findByClientIdAndFreelancerProfileId(String clientId, String freelancerProfileId);
}