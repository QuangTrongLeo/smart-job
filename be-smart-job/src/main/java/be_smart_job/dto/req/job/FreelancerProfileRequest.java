package be_smart_job.dto.req.job;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FreelancerProfileRequest {

    @NotBlank(message = "Tiêu đề không được để trống")
    private String title;

    private String bio;
    private Integer yearsOfExperience;
    private String availabilityStatus;
    private String address;
    private BigDecimal hourlyRate;
    private String availableHours;

    private List<String> languages;
    private List<String> skills;
    private List<WorkExperienceRequest> experiences;
    private List<String> portfolioUrls;
}