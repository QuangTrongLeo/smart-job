package be_smart_job.mapper.job;

import be_smart_job.dto.req.job.FreelancerProfileRequest;
import be_smart_job.dto.res.job.FreelancerProfileResponse;
import be_smart_job.entity.FreelancerProfile;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = {WorkExperienceMapper.class})
public interface FreelancerProfileMapper {

    FreelancerProfile toEntity(FreelancerProfileRequest request);

    @Mapping(target = "fullName", ignore = true)
    @Mapping(target = "email", ignore = true)
    @Mapping(target = "avatarUrl", ignore = true)
    @Mapping(target = "isVerified", ignore = true)
    FreelancerProfileResponse toResponse(FreelancerProfile profile);

    void updateEntityFromRequest(FreelancerProfileRequest request, @MappingTarget FreelancerProfile profile);
}