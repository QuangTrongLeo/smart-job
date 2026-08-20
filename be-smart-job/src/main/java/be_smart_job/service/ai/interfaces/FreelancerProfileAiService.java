package be_smart_job.service.ai.interfaces;

import be_smart_job.entity.FreelancerProfile;

public interface FreelancerProfileAiService {
    void processAndEnrichProfile(FreelancerProfile profile, String rawCvText);
}