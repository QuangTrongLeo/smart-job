package be_smart_job.mapper.social;

import be_smart_job.dto.res.job.JobResponse;
import be_smart_job.dto.res.social.FavoriteJobResponse;
import be_smart_job.entity.FavoriteJob;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface FavoriteJobMapper {

    @Mapping(source = "entity.id", target = "id")
    @Mapping(source = "entity.createdAt", target = "createdAt")
    @Mapping(source = "entity.freelancerId", target = "freelancerId")
    @Mapping(source = "jobResponse", target = "job")
    FavoriteJobResponse toResponse(FavoriteJob entity, JobResponse jobResponse);
}