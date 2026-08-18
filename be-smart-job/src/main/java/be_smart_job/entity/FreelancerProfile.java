package be_smart_job.entity;

import lombok.*;
import lombok.experimental.SuperBuilder;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.ArrayList;
import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Document(collection = "freelancer_profiles")
public class FreelancerProfile extends BaseEntity {

    @Id
    private String id;

    @Indexed(unique = true)
    @Field("user_id")
    private String userId;

    private String title;
    private String bio;
    private Integer yearsOfExperience;
    private String availabilityStatus;

    private String address; // Địa chỉ trực tiếp của Freelancer (VD: "Hà Nội, Việt Nam")

    // AI & Parsed CV Data
    private String cvUrl;
    private List<String> portfolioUrls;
    private String aiParsedBio;
    private List<Double> vector;

    @Builder.Default
    private Double rating = 0.0;

    @Builder.Default
    private Integer reviewCount = 0;

    @Builder.Default
    private Double completionRate = 0.0;

    @Builder.Default
    private List<String> skills = new ArrayList<>();

    @Builder.Default
    private List<WorkExperience> experiences = new ArrayList<>();
}