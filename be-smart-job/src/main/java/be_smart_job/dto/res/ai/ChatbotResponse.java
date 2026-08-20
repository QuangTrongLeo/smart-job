package be_smart_job.dto.res.ai;

import be_smart_job.dto.res.job.JobResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatbotResponse {

    private String reply; // Câu trả lời/tư vấn bằng chữ từ AI
    private List<RecommendedJobItem> recommendedJobs; // Danh sách JobResponse đầy đủ

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RecommendedJobItem {
        private JobResponse job;
        private Double matchScore;
        private String reason;
    }
}