package be_smart_job.repository.ai;

import be_smart_job.entity.JobMatch;
import be_smart_job.enums.MatchStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface JobMatchRepository extends MongoRepository<JobMatch, String> {
    Optional<JobMatch> findByJobIdAndFreelancerId(String jobId, String freelancerId);
    Page<JobMatch> findByFreelancerIdAndStatus(String freelancerId, MatchStatus status, Pageable pageable);
    Page<JobMatch> findByJobId(String jobId, Pageable pageable);
    boolean existsByJobIdAndFreelancerId(String jobId, String freelancerId);
}
