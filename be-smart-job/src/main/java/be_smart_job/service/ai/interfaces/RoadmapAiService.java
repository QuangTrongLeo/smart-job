package be_smart_job.service.ai.interfaces;

import be_smart_job.entity.JobMatch;
import be_smart_job.entity.Roadmap;
import be_smart_job.entity.RoadmapStep;

import java.util.List;

public interface RoadmapAiService {
    Roadmap generateRoadmapForLowMatch(JobMatch match);
    List<RoadmapStep> generateRoadmapSteps(String roadmapId, List<String> missingSkills);
}