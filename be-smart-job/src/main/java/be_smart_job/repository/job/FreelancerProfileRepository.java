package be_smart_job.repository.job;

import be_smart_job.entity.FreelancerProfile;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FreelancerProfileRepository extends MongoRepository<FreelancerProfile, String> {
    Optional<FreelancerProfile> findByUserId(String userId);
    boolean existsByUserId(String userId);
    void deleteByUserId(String userId);
}