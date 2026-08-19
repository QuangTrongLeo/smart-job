package be_smart_job.dto.req.job;

import be_smart_job.enums.CurrencyType;
import be_smart_job.enums.EmploymentType;
import be_smart_job.enums.ExperienceLevel;
import be_smart_job.enums.JobStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobRequest {

    @NotBlank(message = "Tiêu đề công việc không được để trống")
    private String title;

    @NotBlank(message = "Mô tả công việc không được để trống")
    private String description;

    @NotEmpty(message = "Vui lòng chọn ít nhất 1 danh mục")
    private List<String> categoryIds;

    private String companyName;
    private String companyAddress;

    @NotNull(message = "Yêu cầu cấp bậc không được để trống")
    private ExperienceLevel experienceLevel;

    private Integer requiredExperienceYears;

    @NotNull(message = "Hình thức làm việc không được để trống")
    private EmploymentType employmentType;

    private List<String> requiredSkills;

    private BigDecimal minBudget;
    private BigDecimal maxBudget;

    private CurrencyType currency;
    private JobStatus status;
}