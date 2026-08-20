package be_smart_job.repository.social;

import be_smart_job.entity.Conversation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationRepository extends MongoRepository<Conversation, String> {

    Optional<Conversation> findByClientIdAndFreelancerIdAndJobId(String clientId, String freelancerId, String jobId);

    Optional<Conversation> findByClientIdAndFreelancerId(String clientId, String freelancerId);

    // Lấy các cuộc trò chuyện của User có chứa ít nhất 1 tin nhắn (lastMessage != null)
    @Query("{ '$or': [ { 'clientId': ?0 }, { 'freelancerId': ?0 } ], 'lastMessage': { '$ne': null } }")
    List<Conversation> findActiveConversationsByUserId(String userId);
}