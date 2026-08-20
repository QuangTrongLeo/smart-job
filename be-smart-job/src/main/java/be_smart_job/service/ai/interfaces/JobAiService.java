package be_smart_job.service.ai.interfaces;

import be_smart_job.entity.Job;

public interface JobAiService {
    void processAndEnrichJob(Job job);
}