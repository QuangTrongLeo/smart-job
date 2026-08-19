package be_smart_job.repository.social;

import be_smart_job.entity.FavoriteFreelancer;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteFreelancerRepository extends MongoRepository<FavoriteFreelancer, String> {
    Optional<FavoriteFreelancer> findByClientIdAndFreelancerId(String clientId, String freelancerId);
    boolean existsByClientIdAndFreelancerId(String clientId, String freelancerId);
    List<FavoriteFreelancer> findByClientId(String clientId);
    void deleteByClientIdAndFreelancerId(String clientId, String freelancerId);
}