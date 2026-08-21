package be_smart_job.mapper.job;

import be_smart_job.dto.res.identity.UserResponse;
import be_smart_job.dto.res.job.FreelancerInvitationResponse;
import be_smart_job.dto.res.job.FreelancerProfileResponse;
import be_smart_job.entity.FreelancerInvitation;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface FreelancerInvitationMapper {

    @Mapping(target = "id", source = "invitation.id")
    @Mapping(target = "status", source = "invitation.status")
    @Mapping(target = "createdAt", source = "invitation.createdAt")
    @Mapping(target = "updatedAt", source = "invitation.updatedAt")
    @Mapping(target = "client", source = "clientResponse") // Ánh ánh chính xác clientResponse vào field client
    @Mapping(target = "freelancerProfile", source = "profileResponse")
    FreelancerInvitationResponse toResponse(
            FreelancerInvitation invitation,
            UserResponse clientResponse,
            FreelancerProfileResponse profileResponse
    );
}