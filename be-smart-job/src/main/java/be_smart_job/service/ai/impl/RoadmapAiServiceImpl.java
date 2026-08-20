package be_smart_job.service.ai.impl;

import be_smart_job.entity.JobMatch;
import be_smart_job.entity.Roadmap;
import be_smart_job.entity.RoadmapStep;
import be_smart_job.service.ai.interfaces.GeminiClientService;
import be_smart_job.service.ai.interfaces.RoadmapAiService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RoadmapAiServiceImpl implements RoadmapAiService {

    private final GeminiClientService geminiClientService;
    private final ObjectMapper objectMapper;

    @Override
    public Roadmap generateRoadmapForLowMatch(JobMatch match) {
        if (match.getMatchScore() >= 80.0) {
            return null; // Không cần lộ trình nếu điểm phù hợp >= 80%
        }

        return Roadmap.builder()
                .matchId(match.getId())
                .freelancerId(match.getFreelancerId())
                .jobId(match.getJobId())
                .currentScore(match.getMatchScore())
                .targetScore(85.0)
                .totalSteps(match.getMissingSkills().size())
                .completedSteps(0)
                .build();
    }

    @Override
    public List<RoadmapStep> generateRoadmapSteps(String roadmapId, List<String> missingSkills) {
        String prompt = String.format("""
            Xây dựng lộ trình học tập để khắc phục các kỹ năng còn thiếu: %s.
            
            Trả về danh sách các bước dạng JSON:
            [
              {
                "stepNumber": 1,
                "missingSkill": "Docker",
                "action": "Thực hành đóng gói ứng dụng Java Spring Boot vào Container.",
                "resourceUrl": "https://docs.docker.com/get-started/",
                "estimatedHours": 10
              }
            ]
            """, missingSkills);

        List<RoadmapStep> steps = new ArrayList<>();
        try {
            String jsonResponse = geminiClientService.generateJsonContent(prompt);
            JsonNode rootNode = objectMapper.readTree(jsonResponse);

            if (rootNode.isArray()) {
                for (JsonNode stepNode : rootNode) {
                    RoadmapStep step = RoadmapStep.builder()
                            .roadmapId(roadmapId)
                            .stepNumber(stepNode.get("stepNumber").asInt())
                            .missingSkill(stepNode.get("missingSkill").asText())
                            .action(stepNode.get("action").asText())
                            .resourceUrl(stepNode.get("resourceUrl").asText())
                            .estimatedHours(stepNode.get("estimatedHours").asInt())
                            .isCompleted(false)
                            .build();
                    steps.add(step);
                }
            }
            return steps;

        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi tạo danh sách các bước Roadmap: " + e.getMessage());
        }
    }
}