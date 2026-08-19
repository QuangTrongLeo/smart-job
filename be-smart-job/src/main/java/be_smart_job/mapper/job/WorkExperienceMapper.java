package be_smart_job.mapper.job;

import be_smart_job.dto.req.job.WorkExperienceRequest;
import be_smart_job.dto.res.job.WorkExperienceResponse;
import be_smart_job.entity.WorkExperience;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface WorkExperienceMapper {
    WorkExperience toEntity(WorkExperienceRequest request);
    WorkExperienceResponse toResponse(WorkExperience entity);
    List<WorkExperience> toEntityList(List<WorkExperienceRequest> requests);
    List<WorkExperienceResponse> toResponseList(List<WorkExperience> entities);
    void updateEntityFromRequest(WorkExperienceRequest request, @MappingTarget WorkExperience entity);
}