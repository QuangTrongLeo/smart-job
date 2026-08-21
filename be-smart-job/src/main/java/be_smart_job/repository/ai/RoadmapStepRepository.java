package be_smart_job.repository.ai;

import be_smart_job.entity.RoadmapStep;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoadmapStepRepository extends MongoRepository<RoadmapStep, String> {
    List<RoadmapStep> findByRoadmapIdOrderByStepNumberAsc(String roadmapId);
    void deleteByRoadmapId(String roadmapId);
}