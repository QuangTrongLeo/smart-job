package be_smart_job.entity;

import be_smart_job.enums.JobStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
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

    private String title;
    private String rawDescription;

    // AI Processed Data
    private String structuredDescription;
    private List<String> extractedSkills;
    private Integer requiredExperienceMonths;
    private List<Double> jobVector;

    // Budget Info
    private BigDecimal budgetMin;
    private BigDecimal budgetMax;

    @Builder.Default
    private String currency = "USD";

    @Builder.Default
    private JobStatus status = JobStatus.OPEN;
}