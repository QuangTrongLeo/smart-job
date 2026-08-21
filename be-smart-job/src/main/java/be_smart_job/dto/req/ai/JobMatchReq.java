package be_smart_job.dto.req.ai;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobMatchReq {

    @NotBlank(message = "Job ID không được để trống")
    private String jobId;

    private String freelancerId;
}