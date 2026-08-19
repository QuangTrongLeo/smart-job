package be_smart_job.service.social.interfaces;

import be_smart_job.dto.res.social.FavoriteFreelancerResponse;
import be_smart_job.dto.res.social.FavoriteJobResponse;

import java.util.List;

public interface FavoriteService {
    // Thao tác của Freelancer với Job
    boolean toggleFavoriteJob(String jobId);
    List<FavoriteJobResponse> getMyFavoriteJobs();

    // Thao tác của Client với Freelancer
    boolean toggleFavoriteFreelancer(String freelancerId);
    List<FavoriteFreelancerResponse> getMyFavoriteFreelancers();
}