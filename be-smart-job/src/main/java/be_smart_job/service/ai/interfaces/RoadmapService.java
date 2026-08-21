package be_smart_job.service.ai.interfaces;

import be_smart_job.dto.req.ai.RoadmapReq;
import be_smart_job.dto.res.ai.RoadmapResponse;
import be_smart_job.dto.res.ai.RoadmapStepResponse;

import java.util.List;

public interface RoadmapService {
    RoadmapResponse generateRoadmap(RoadmapReq request);
    RoadmapResponse generateRoadmap(String matchId);
    RoadmapResponse getRoadmapByMatchId(String matchId);
    RoadmapStepResponse toggleStepCompletion(String stepId, Boolean isCompleted);
    List<RoadmapResponse> getMyRoadmaps();
}