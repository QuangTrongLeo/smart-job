package be_smart_job.dto.res.job;

import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FreelancerProfileResponse {
    private String id;
    private String userId;

    // User Info
    private String fullName;
    private String email;
    private String avatarUrl;
    private Boolean isVerified;

    // Profile Info
    private String title;
    private String bio;
    private Integer yearsOfExperience;
    private String availabilityStatus;
    private String address;
    private BigDecimal hourlyRate;
    private String availableHours;
    private List<String> languages;

    private Double rating;
    private Integer reviewCount;
    private Double completionRate;

    private List<String> skills;
    private List<WorkExperienceResponse> experiences;
    private List<String> portfolioUrls;
    private String cvUrl;

    private Instant createdAt;
    private Instant updatedAt;
}