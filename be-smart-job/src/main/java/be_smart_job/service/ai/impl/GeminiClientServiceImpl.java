package be_smart_job.service.ai.impl;

import be_smart_job.service.ai.interfaces.GeminiClientService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class GeminiClientServiceImpl implements GeminiClientService {

    private final WebClient geminiWebClient;

    @Value("${gemini.api.model:gemini-1.5-flash}")
    private String model;

    @Override
    public String generateJsonContent(String prompt) {
        String uri = String.format("/models/%s:generateContent", model);

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(Map.of("parts", List.of(Map.of("text", prompt)))),
                "generationConfig", Map.of("responseMimeType", "application/json")
        );

        Map response = geminiWebClient.post()
                .uri(uri)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        return parseResponseText(response);
    }

    @Override
    public List<Double> generateEmbedding(String text) {
        String uri = "/models/text-embedding-004:embedContent";

        Map<String, Object> requestBody = Map.of(
                "model", "models/text-embedding-004",
                "content", Map.of("parts", List.of(Map.of("text", text)))
        );

        Map response = geminiWebClient.post()
                .uri(uri)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        Map embeddingData = (Map) response.get("embedding");
        List<Number> values = (List<Number>) embeddingData.get("values");
        return values.stream().map(Number::doubleValue).toList();
    }

    private String parseResponseText(Map response) {
        try {
            List candidates = (List) response.get("candidates");
            Map firstCandidate = (Map) candidates.get(0);
            Map content = (Map) firstCandidate.get("content");
            List parts = (List) content.get("parts");
            Map firstPart = (Map) parts.get(0);
            return (String) firstPart.get("text");
        } catch (Exception e) {
            throw new RuntimeException("Lỗi giải mã phản hồi từ Gemini API: " + e.getMessage());
        }
    }
}