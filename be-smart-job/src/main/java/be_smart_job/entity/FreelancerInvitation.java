package be_smart_job.entity;

import be_smart_job.enums.InvitationStatus;
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
@Document(collection = "freelancer_invitations")
public class FreelancerInvitation extends BaseEntity {

    @Id
    private String id;

    @Indexed
    @Field("client_id")
    private String clientId;                // User ID của Client gửi lời mời

    @Indexed
    @Field("freelancer_profile_id")
    private String freelancerProfileId;    // ID của FreelancerProfile được mời

    @Indexed
    @Field("freelancer_user_id")
    private String freelancerUserId;       // User ID của Freelancer (tiện cho việc query)

    @Builder.Default
    private InvitationStatus status = InvitationStatus.PENDING;
}