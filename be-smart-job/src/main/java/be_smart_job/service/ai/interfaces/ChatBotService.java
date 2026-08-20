package be_smart_job.service.ai.interfaces;

import be_smart_job.dto.req.ai.ChatbotReq;
import be_smart_job.dto.res.ai.ChatbotResponse;

public interface ChatBotService {
    ChatbotResponse chatAndRecommendJobs(ChatbotReq request);
}