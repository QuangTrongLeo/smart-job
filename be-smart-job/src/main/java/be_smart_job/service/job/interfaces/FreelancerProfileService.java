package be_smart_job.service.job.interfaces;

import be_smart_job.dto.req.job.FreelancerProfileRequest;
import be_smart_job.dto.res.job.FreelancerProfileResponse;

import java.util.List;

public interface FreelancerProfileService {
    List<FreelancerProfileResponse> getAllProfiles();
    FreelancerProfileResponse getProfileById(String id); // Đã đổi từ getProfileByUserId(userId)
    FreelancerProfileResponse getMyProfile();
    FreelancerProfileResponse createMyProfile(FreelancerProfileRequest request);
    FreelancerProfileResponse updateMyProfile(FreelancerProfileRequest request);
    void deleteMyProfile();
}