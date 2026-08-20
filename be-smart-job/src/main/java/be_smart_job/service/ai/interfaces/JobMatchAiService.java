package be_smart_job.service.ai.interfaces;

import be_smart_job.entity.FreelancerProfile;
import be_smart_job.entity.Job;
import be_smart_job.entity.JobMatch;

public interface JobMatchAiService {
    JobMatch calculateAndCreateMatch(Job job, FreelancerProfile profile);
}