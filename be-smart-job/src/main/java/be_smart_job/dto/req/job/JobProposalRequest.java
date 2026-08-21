package be_smart_job.dto.req.job;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobProposalRequest {

    @NotBlank(message = "ID công việc không được để trống")
    private String jobId;
}