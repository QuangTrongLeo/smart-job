package be_smart_job.dto.res.ai;

import be_smart_job.dto.res.job.WorkExperienceResponse;
import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CvParseResponse {
    private String title;
    private String bio;
    private Integer yearsOfExperience;
    private List<String> skills;
    private List<WorkExperienceResponse> experiences;
    private List<String> languages;
}