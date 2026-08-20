package be_smart_job.service.ai.interfaces;

import be_smart_job.dto.req.ai.ChatbotReq;
import be_smart_job.dto.res.ai.ChatbotResponse;

public interface ChatbotAiService {

    /**
     * Phân tích CV (PDF/DOCX) và câu hỏi người dùng để đề xuất các việc làm phù hợp
     *
     * @param request Chứa file CV (nếu có) và nội dung nhắn tin từ người dùng
     * @return ChatbotResponse chứa câu trả lời văn bản và danh sách JobResponse đầy đủ
     */
    ChatbotResponse suggestJobsFromCv(ChatbotReq request);
}