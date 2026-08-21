package be_smart_job.service.ai.interfaces;

import be_smart_job.dto.req.ai.JobMatchReq;
import be_smart_job.dto.res.ai.JobMatchResponse;

public interface JobMatchService {
    JobMatchResponse matchFreelancerToJob(String jobId, String freelancerId);
    JobMatchResponse matchFreelancerToJob(JobMatchReq request);
}