package be_smart_job.dto.res.job;

import be_smart_job.enums.CurrencyType;
import be_smart_job.enums.EmploymentType;
import be_smart_job.enums.ExperienceLevel;
import be_smart_job.enums.JobStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobResponse {
    private String id;
    private String clientId;
    private List<String> categoryIds;
    private String title;
    private String description;
    private String companyName;
    private String companyAddress;
    private ExperienceLevel experienceLevel;
    private Integer requiredExperienceYears;
    private EmploymentType employmentType;
    private List<String> requiredSkills;
    private BigDecimal minBudget;
    private BigDecimal maxBudget;
    private CurrencyType currency;
    private JobStatus status;
    private Instant createdAt;
    private Instant updatedAt;
}