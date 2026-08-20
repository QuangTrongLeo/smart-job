package be_smart_job.service.ai.impl;

import be_smart_job.entity.Job;
import be_smart_job.service.ai.interfaces.GeminiClientService;
import be_smart_job.service.ai.interfaces.JobAiService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class JobAiServiceImpl implements JobAiService {

    private final GeminiClientService geminiClientService;
    private final ObjectMapper objectMapper;

    @Override
    public void processAndEnrichJob(Job job) {
        String prompt = String.format("""
            Phân tích và chuẩn hóa mô tả công việc thô sau:
            Tiêu đề: %s
            Mô tả: %s
            
            Trả về định dạng JSON duy nhất:
            {
              "aiParsedDesc": "Đoạn mô tả ngắn gọn, rõ ràng, chuẩn hóa thuật ngữ chuyên ngành.",
              "requiredSkills": ["Java", "Spring Boot", "MongoDB"]
            }
            """, job.getTitle(), job.getDescription());

        try {
            String jsonResponse = geminiClientService.generateJsonContent(prompt);
            JsonNode node = objectMapper.readTree(jsonResponse);

            job.setAiParsedDesc(node.get("aiParsedDesc").asText());

            List<String> skills = new ArrayList<>();
            node.get("requiredSkills").forEach(s -> skills.add(s.asText()));
            job.setRequiredSkills(skills);

            // Tạo Vector Embedding từ mô tả đã chuẩn hóa
            String textForEmbedding = job.getTitle() + " " + job.getAiParsedDesc() + " " + String.join(", ", skills);
            job.setVector(geminiClientService.generateEmbedding(textForEmbedding));

        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi xử lý AI cho Job: " + e.getMessage());
        }
    }
}