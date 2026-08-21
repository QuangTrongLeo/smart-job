package be_smart_job.mapper.ai;

import be_smart_job.dto.res.ai.JobMatchResponse;
import be_smart_job.entity.JobMatch;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface JobMatchMapper {
    JobMatchResponse toResponse(JobMatch jobMatch);
}