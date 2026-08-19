package be_smart_job.dto.res.job;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkExperienceResponse {
    private String title;
    private String company;
    private String startDate;
    private String endDate;
    private Boolean isCurrent;
    private String description;
}