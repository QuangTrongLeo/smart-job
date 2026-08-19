package be_smart_job.repository.social;

import be_smart_job.entity.FavoriteJob;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteJobRepository extends MongoRepository<FavoriteJob, String> {
    Optional<FavoriteJob> findByFreelancerIdAndJobId(String freelancerId, String jobId);
    boolean existsByFreelancerIdAndJobId(String freelancerId, String jobId);
    List<FavoriteJob> findByFreelancerId(String freelancerId);
    void deleteByFreelancerIdAndJobId(String freelancerId, String jobId);
}