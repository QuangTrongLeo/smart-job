package be_smart_job.entity;

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

import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Document(collection = "profiles")
public class Profile extends BaseEntity {

    @Id
    private String id;

    @Indexed(unique = true)
    @Field("user_id")
    private String userId;

    private String fullName;
    private String bio;

    // Freelancer Info
    private List<String> rawCvUrls;
    private List<String> portfolioLinks;
    private List<String> parsedSkills;
    private Integer experienceYears;
    private String aiSummary;
    private List<Double> skillVector;

    // Client Info
    private String companyName;
    private String companyWebsite;
    private String industry;
}