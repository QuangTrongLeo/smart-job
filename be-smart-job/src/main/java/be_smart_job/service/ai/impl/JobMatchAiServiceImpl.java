package be_smart_job.service.ai.impl;

import be_smart_job.entity.FreelancerProfile;
import be_smart_job.entity.Job;
import be_smart_job.entity.JobMatch;
import be_smart_job.enums.MatchStatus;
import be_smart_job.service.ai.interfaces.GeminiClientService;
import be_smart_job.service.ai.interfaces.JobMatchAiService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class JobMatchAiServiceImpl implements JobMatchAiService {

    private final GeminiClientService geminiClientService;
    private final ObjectMapper objectMapper;

    @Override
    public JobMatch calculateAndCreateMatch(Job job, FreelancerProfile profile) {
        String prompt = String.format("""
            So sánh độ phù hợp giữa Yêu cầu công việc và Hồ sơ Freelancer:
            CÔNG VIỆC: %s | Kỹ năng yêu cầu: %s
            FREELANCER: %s | Kỹ năng hiện có: %s
            
            Trả về JSON phân tích:
            {
              "matchScore": 75.0,
              "matchingSkills": ["Java", "Spring Boot"],
              "missingSkills": ["Docker", "AWS"],
              "explanation": "Freelancer đáp ứng tốt tư duy backend nhưng còn thiếu kinh nghiệm triển khai Cloud."
            }
            """, job.getAiParsedDesc(), job.getRequiredSkills(), profile.getAiParsedBio(), profile.getSkills());

        try {
            String jsonResponse = geminiClientService.generateJsonContent(prompt);
            JsonNode node = objectMapper.readTree(jsonResponse);

            List<String> matchingSkills = new ArrayList<>();
            node.get("matchingSkills").forEach(s -> matchingSkills.add(s.asText()));

            List<String> missingSkills = new ArrayList<>();
            node.get("missingSkills").forEach(s -> missingSkills.add(s.asText()));

            return JobMatch.builder()
                    .jobId(job.getId())
                    .freelancerId(profile.getId())
                    .matchScore(node.get("matchScore").asDouble())
                    .matchingSkills(matchingSkills)
                    .missingSkills(missingSkills)
                    .explanation(node.get("explanation").asText())
                    .status(MatchStatus.SUGGESTED)
                    .build();

        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi tính toán Match Score: " + e.getMessage());
        }
    }
}