package be_smart_job.mapper.job;

import be_smart_job.dto.res.identity.UserResponse;
import be_smart_job.dto.res.job.JobMatchResponse;
import be_smart_job.dto.res.job.JobResponse;
import be_smart_job.entity.JobMatch;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", implementationName = "JobJobMatchMapperImpl")
public interface JobMatchMapper {

    @Mapping(target = "id", source = "match.id")
    @Mapping(target = "status", source = "match.status")
    @Mapping(target = "createdAt", source = "match.createdAt")
    @Mapping(target = "updatedAt", source = "match.updatedAt")
    @Mapping(target = "job", source = "jobResponse")
    @Mapping(target = "freelancer", source = "freelancerResponse")
    JobMatchResponse toResponse(
            JobMatch match,
            JobResponse jobResponse,
            UserResponse freelancerResponse
    );
}