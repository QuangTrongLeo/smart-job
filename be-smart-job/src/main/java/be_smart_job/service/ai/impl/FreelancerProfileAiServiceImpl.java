package be_smart_job.service.ai.impl;

import be_smart_job.entity.FreelancerProfile;
import be_smart_job.service.ai.interfaces.FreelancerProfileAiService;
import be_smart_job.service.ai.interfaces.GeminiClientService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FreelancerProfileAiServiceImpl implements FreelancerProfileAiService {

    private final GeminiClientService geminiClientService;
    private final ObjectMapper objectMapper;

    @Override
    public void processAndEnrichProfile(FreelancerProfile profile, String rawCvText) {
        String contentToParse = rawCvText != null && !rawCvText.isBlank() ? rawCvText : profile.getBio();

        String prompt = String.format("""
            Trích xuất thông tin hồ sơ/CV freelancer sau đây:
            Text: %s
            
            Trả về định dạng JSON:
            {
              "aiParsedBio": "Tóm tắt kinh nghiệm làm việc và thế mạnh nổi bật.",
              "skills": ["ReactJS", "NodeJS", "TypeScript"]
            }
            """, contentToParse);

        try {
            String jsonResponse = geminiClientService.generateJsonContent(prompt);
            JsonNode node = objectMapper.readTree(jsonResponse);

            profile.setAiParsedBio(node.get("aiParsedBio").asText());

            List<String> skills = new ArrayList<>();
            node.get("skills").forEach(s -> skills.add(s.asText()));
            profile.setSkills(skills);

            // Tạo Vector Embedding cho Hồ sơ
            String textForEmbedding = profile.getTitle() + " " + profile.getAiParsedBio() + " " + String.join(", ", skills);
            profile.setVector(geminiClientService.generateEmbedding(textForEmbedding));

        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi xử lý AI cho Profile: " + e.getMessage());
        }
    }
}