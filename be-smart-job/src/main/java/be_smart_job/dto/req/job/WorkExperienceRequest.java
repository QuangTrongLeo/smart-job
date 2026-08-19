package be_smart_job.dto.req.job;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkExperienceRequest {

    @NotBlank(message = "Chức danh không được để trống")
    private String title;

    @NotBlank(message = "Tên công ty không được để trống")
    private String company;

    @NotBlank(message = "Ngày bắt đầu không được để trống")
    private String startDate;

    private String endDate;

    @Builder.Default
    private Boolean isCurrent = false;

    private String description;
}