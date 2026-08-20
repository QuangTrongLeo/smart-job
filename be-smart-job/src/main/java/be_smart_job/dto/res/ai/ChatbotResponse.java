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
    private String text;
    private List<JobResponse> recommendedJobs;
}