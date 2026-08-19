package be_smart_job.mapper.job;

import be_smart_job.dto.req.job.FreelancerProfileRequest;
import be_smart_job.dto.res.job.FreelancerProfileResponse;
import be_smart_job.entity.FreelancerProfile;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface FreelancerProfileMapper {

    // Chuyển Request -> Entity
    FreelancerProfile toEntity(FreelancerProfileRequest request);

    // Cập nhật Entity từ Request
    void updateEntityFromRequest(FreelancerProfileRequest request, @MappingTarget FreelancerProfile profile);

    // Chuyển Entity -> Response (Bỏ qua user để enrich thủ công ở Service)
    @Mapping(target = "user", ignore = true)
    FreelancerProfileResponse toResponse(FreelancerProfile profile);
}