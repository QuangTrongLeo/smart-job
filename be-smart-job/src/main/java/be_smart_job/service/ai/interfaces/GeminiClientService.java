package be_smart_job.service.ai.interfaces;

import java.util.List;

public interface GeminiClientService {
    String generateJsonContent(String prompt);
    List<Double> generateEmbedding(String text);
}