package be_smart_job.mapper.ai;

import be_smart_job.dto.res.ai.RoadmapResponse;
import be_smart_job.dto.res.ai.RoadmapStepResponse;
import be_smart_job.entity.Roadmap;
import be_smart_job.entity.RoadmapStep;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class RoadmapMapper {

    public RoadmapStepResponse toStepResponse(RoadmapStep step) {
        if (step == null) return null;
        return RoadmapStepResponse.builder()
                .id(step.getId())
                .roadmapId(step.getRoadmapId())
                .stepNumber(step.getStepNumber())
                .missingSkill(step.getMissingSkill())
                .action(step.getAction())
                .resourceUrl(step.getResourceUrl())
                .estimatedHours(step.getEstimatedHours())
                .isCompleted(step.getIsCompleted())
                .createdAt(step.getCreatedAt())
                .updatedAt(step.getUpdatedAt())
                .build();
    }

    public RoadmapResponse toResponse(Roadmap roadmap, List<RoadmapStep> steps) {
        if (roadmap == null) return null;

        List<RoadmapStepResponse> stepResponses = (steps != null)
                ? steps.stream().map(this::toStepResponse).collect(Collectors.toList())
                : Collections.emptyList();

        return RoadmapResponse.builder()
                .id(roadmap.getId())
                .matchId(roadmap.getMatchId())
                .freelancerId(roadmap.getFreelancerId())
                .jobId(roadmap.getJobId())
                .currentScore(roadmap.getCurrentScore())
                .targetScore(roadmap.getTargetScore())
                .totalSteps(roadmap.getTotalSteps())
                .completedSteps(roadmap.getCompletedSteps())
                .steps(stepResponses)
                .createdAt(roadmap.getCreatedAt())
                .updatedAt(roadmap.getUpdatedAt())
                .build();
    }
}