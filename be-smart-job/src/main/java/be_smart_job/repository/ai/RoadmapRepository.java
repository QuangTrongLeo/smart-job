package be_smart_job.repository.ai;

import be_smart_job.entity.Roadmap;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoadmapRepository extends MongoRepository<Roadmap, String> {
    Optional<Roadmap> findByMatchId(String matchId);
    List<Roadmap> findByFreelancerId(String freelancerId);
    Optional<Roadmap> findByFreelancerIdAndJobId(String freelancerId, String jobId);
}
