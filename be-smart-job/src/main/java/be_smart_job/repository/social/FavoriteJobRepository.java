package be_smart_job.repository.social;

import be_smart_job.entity.FavoriteJob;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FavoriteJobRepository extends MongoRepository<FavoriteJob, String> {
    Page<FavoriteJob> findByFreelancerId(String freelancerId, Pageable pageable);
    Optional<FavoriteJob> findByFreelancerIdAndJobId(String freelancerId, String jobId);
    boolean existsByFreelancerIdAndJobId(String freelancerId, String jobId);
    void deleteByFreelancerIdAndJobId(String freelancerId, String jobId);
}