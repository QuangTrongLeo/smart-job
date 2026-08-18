package be_smart_job.repository.ai;

import be_smart_job.entity.RoadmapStep;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoadmapStepRepository extends MongoRepository<RoadmapStep, String> {
    List<RoadmapStep> findByRoadmapIdOrderByStepNumberAsc(String roadmapId);
    Optional<RoadmapStep> findByRoadmapIdAndStepNumber(String roadmapId, Integer stepNumber);
    void deleteByRoadmapId(String roadmapId);
}
