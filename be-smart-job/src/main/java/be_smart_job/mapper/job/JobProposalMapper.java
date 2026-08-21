package be_smart_job.mapper.job;

import be_smart_job.dto.res.identity.UserResponse;
import be_smart_job.dto.res.job.FreelancerProfileResponse;
import be_smart_job.dto.res.job.JobProposalResponse;
import be_smart_job.entity.JobProposal;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface JobProposalMapper {

    @Mapping(target = "id", source = "proposal.id")
    @Mapping(target = "status", source = "proposal.status")
    @Mapping(target = "createdAt", source = "proposal.createdAt")
    @Mapping(target = "updatedAt", source = "proposal.updatedAt")
    @Mapping(target = "client", source = "client")
    @Mapping(target = "freelancerProfile", source = "profile")
    JobProposalResponse toResponse(
            JobProposal proposal,
            UserResponse client,
            FreelancerProfileResponse profile
    );
}