package be_smart_job.entity;

import be_smart_job.enums.CurrencyType; // Import Enum CurrencyType
import be_smart_job.enums.EmploymentType;
import be_smart_job.enums.ExperienceLevel;
import be_smart_job.enums.JobStatus;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.math.BigDecimal;
import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Document(collection = "jobs")
public class Job extends BaseEntity {

    @Id
    private String id;

    @Indexed
    @Field("client_id")
    private String clientId;

    @Indexed
    @Field("category_id")
    private String categoryId;

    private String title;
    private String description;

    // Company Info
    private String companyName;
    private String companyAddress;

    // Work Requirements
    private ExperienceLevel experienceLevel;
    private Integer requiredExperienceYears;
    private EmploymentType employmentType;

    // AI Processed Data
    private String aiParsedDesc;
    private List<String> requiredSkills;
    private List<Double> vector;

    // Budget Info
    private BigDecimal minBudget;
    private BigDecimal maxBudget;

    @Builder.Default
    private CurrencyType currency = CurrencyType.VND;

    @Builder.Default
    private JobStatus status = JobStatus.OPEN;
}