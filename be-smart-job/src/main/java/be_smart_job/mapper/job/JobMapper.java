package be_smart_job.mapper.job;

import be_smart_job.dto.req.job.JobRequest;
import be_smart_job.dto.res.job.JobResponse;
import be_smart_job.entity.Job;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface JobMapper {
    JobResponse toResponse(Job job);
    Job toEntity(JobRequest request);
    void updateEntityFromRequest(JobRequest request, @MappingTarget Job job);
}