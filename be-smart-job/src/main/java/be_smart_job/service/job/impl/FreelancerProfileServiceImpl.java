package be_smart_job.service.job.impl;

import be_smart_job.dto.req.job.FreelancerProfileRequest;
import be_smart_job.dto.res.job.FreelancerProfileResponse;
import be_smart_job.entity.FreelancerProfile;
import be_smart_job.entity.User;
import be_smart_job.enums.UserStatus;
import be_smart_job.mapper.job.FreelancerProfileMapper;
import be_smart_job.repository.identity.UserRepository;
import be_smart_job.repository.job.FreelancerProfileRepository;
import be_smart_job.service.job.interfaces.FreelancerProfileService;
import be_smart_job.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FreelancerProfileServiceImpl implements FreelancerProfileService {

    private final FreelancerProfileRepository profileRepository;
    private final UserRepository userRepository;
    private final FreelancerProfileMapper profileMapper;

    @Override
    public List<FreelancerProfileResponse> getAllProfiles() {
        return profileRepository.findAll()
                .stream()
                .map(this::enrichAndMapResponse)
                .toList();
    }

    @Override
    public FreelancerProfileResponse getProfileByUserId(String userId) {
        FreelancerProfile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy hồ sơ với User ID: " + userId));
        return enrichAndMapResponse(profile);
    }

    @Override
    public FreelancerProfileResponse getMyProfile() {
        validateFreelancerRole();
        String currentUserId = SecurityUtils.getCurrentUserId();
        FreelancerProfile profile = profileRepository.findByUserId(currentUserId)
                .orElseThrow(() -> new IllegalArgumentException("Bạn chưa tạo hồ sơ Freelancer"));
        return enrichAndMapResponse(profile);
    }

    @Override
    public FreelancerProfileResponse createMyProfile(FreelancerProfileRequest request) {
        validateFreelancerRole();
        String currentUserId = SecurityUtils.getCurrentUserId();

        if (profileRepository.existsByUserId(currentUserId)) {
            throw new IllegalArgumentException("Hồ sơ Freelancer của bạn đã tồn tại, không thể tạo mới!");
        }

        FreelancerProfile profile = profileMapper.toEntity(request);
        profile.setUserId(currentUserId);

        FreelancerProfile saved = profileRepository.save(profile);
        return enrichAndMapResponse(saved);
    }

    @Override
    public FreelancerProfileResponse updateMyProfile(FreelancerProfileRequest request) {
        validateFreelancerRole();
        String currentUserId = SecurityUtils.getCurrentUserId();

        FreelancerProfile profile = profileRepository.findByUserId(currentUserId)
                .orElseThrow(() -> new IllegalArgumentException("Chưa tìm thấy hồ sơ để cập nhật, vui lòng tạo hồ sơ trước!"));

        profileMapper.updateEntityFromRequest(request, profile);

        FreelancerProfile updated = profileRepository.save(profile);
        return enrichAndMapResponse(updated);
    }

    @Override
    public void deleteMyProfile() {
        validateFreelancerRole();
        String currentUserId = SecurityUtils.getCurrentUserId();

        if (!profileRepository.existsByUserId(currentUserId)) {
            throw new IllegalArgumentException("Không tìm thấy hồ sơ để xóa!");
        }

        profileRepository.deleteByUserId(currentUserId);
    }

    private void validateFreelancerRole() {
        if (!SecurityUtils.hasRole("FREELANCER")) {
            throw new AccessDeniedException("Chỉ người dùng có vai trò FREELANCER mới được thực hiện thao tác này");
        }
    }

    private FreelancerProfileResponse enrichAndMapResponse(FreelancerProfile profile) {
        FreelancerProfileResponse response = profileMapper.toResponse(profile);
        User user = userRepository.findById(profile.getUserId()).orElse(null);

        if (user != null) {
            String fullName = (user.getLastName() != null ? user.getLastName() + " " : "") +
                    (user.getFirstName() != null ? user.getFirstName() : "");
            response.setFullName(fullName.trim());
            response.setEmail(user.getEmail());
            response.setAvatarUrl(user.getAvatarUrl());
            response.setIsVerified(user.getStatus() == UserStatus.ACTIVE);
        }

        return response;
    }
}