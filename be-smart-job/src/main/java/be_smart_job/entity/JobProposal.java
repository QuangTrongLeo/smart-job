package be_smart_job.entity;

import be_smart_job.enums.ProposalStatus;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Document(collection = "job_proposals")
public class JobProposal extends BaseEntity {

    @Id
    private String id;

    @Indexed
    @Field("job_id")
    private String jobId;                    // ID bài đăng Công việc của Client

    @Indexed
    @Field("client_id")
    private String clientId;                 // User ID của Client sở hữu Job

    @Indexed
    @Field("freelancer_user_id")
    private String freelancerUserId;        // User ID của Freelancer nộp bài

    @Indexed
    @Field("freelancer_profile_id")
    private String freelancerProfileId;     // Profile ID của Freelancer

    @Builder.Default
    private ProposalStatus status = ProposalStatus.PENDING;
}