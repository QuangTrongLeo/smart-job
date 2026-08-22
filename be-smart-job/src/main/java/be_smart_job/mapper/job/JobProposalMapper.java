package be_smart_job.mapper.job;

import be_smart_job.dto.res.identity.UserResponse;
import be_smart_job.dto.res.job.FreelancerProfileResponse;
import be_smart_job.dto.res.job.JobProposalResponse;
import be_smart_job.dto.res.job.JobResponse;
import be_smart_job.entity.JobProposal;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface JobProposalMapper {

    @Mapping(target = "id", source = "proposal.id")
    @Mapping(target = "status", source = "proposal.status")
    @Mapping(target = "createdAt", source = "proposal.createdAt")
    @Mapping(target = "updatedAt", source = "proposal.updatedAt")
    @Mapping(target = "job", source = "jobResponse")
    @Mapping(target = "client", source = "clientResponse")
    @Mapping(target = "freelancer", source = "freelancerResponse")
    @Mapping(target = "freelancerProfile", source = "profileResponse")
    JobProposalResponse toResponse(
            JobProposal proposal,
            JobResponse jobResponse,
            UserResponse clientResponse,
            UserResponse freelancerResponse,
            FreelancerProfileResponse profileResponse
    );
}