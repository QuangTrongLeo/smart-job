package be_smart_job.service.job.interfaces;

import be_smart_job.dto.req.job.JobRequest;
import be_smart_job.dto.res.job.JobResponse;

import java.util.List;

public interface JobService {
    List<JobResponse> getAllJobs();
    JobResponse getJobById(String id);
    List<JobResponse> getMyJobs();
    JobResponse createJob(JobRequest request);
    JobResponse updateJob(String id, JobRequest request);
    void deleteJob(String id);
}