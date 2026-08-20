package be_smart_job.dto.req.ai;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobParseReq {

    private String title;

    @NotBlank(message = "Mô tả công việc không được để trống")
    private String description;
}