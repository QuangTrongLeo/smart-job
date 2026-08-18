package be_smart_job.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkExperience {
    private String title;
    private String company;
    private String startDate;
    private String endDate;
    private Boolean isCurrent;
    private String description;
}