package be_smart_job.mapper.social;

import be_smart_job.dto.res.job.FreelancerProfileResponse;
import be_smart_job.dto.res.social.FavoriteFreelancerResponse;
import be_smart_job.entity.FavoriteFreelancer;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface FavoriteFreelancerMapper {

    @Mapping(source = "entity.id", target = "id")
    @Mapping(source = "entity.createdAt", target = "createdAt")
    @Mapping(source = "entity.clientId", target = "clientId")
    @Mapping(source = "profileResponse", target = "freelancer")
    FavoriteFreelancerResponse toResponse(FavoriteFreelancer entity, FreelancerProfileResponse profileResponse);
}