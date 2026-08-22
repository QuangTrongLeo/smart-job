package be_smart_job.service.job.interfaces;

import be_smart_job.dto.res.job.JobMatchResponse;

public interface JobMatchService {
    JobMatchResponse getMatchByJobAndFreelancer(String jobId, String freelancerId);
}