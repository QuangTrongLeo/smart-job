package be_smart_job.repository.job;

import be_smart_job.entity.JobMatch;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface JobMatchRepository extends MongoRepository<JobMatch, String> {
    Optional<JobMatch> findByJobIdAndFreelancerId(String jobId, String freelancerId);
}
