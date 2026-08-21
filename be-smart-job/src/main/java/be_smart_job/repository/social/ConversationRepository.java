package be_smart_job.repository.social;

import be_smart_job.entity.Conversation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ConversationRepository extends MongoRepository<Conversation, String> {

    // Lấy danh sách conversation mà user tham gia (dù là Client hay Freelancer) và ĐÃ CÓ tin nhắn
    @Query("{ '$or': [ { 'clientId': ?0 }, { 'freelancerId': ?0 } ], 'lastMessage': { '$ne': null, '$exists': true } }")
    List<Conversation> findActiveConversationsByUserId(String userId);

    // Tìm cuộc trò chuyện giữa 2 user theo Job ID (không phụ thuộc ai là client, ai là freelancer)
    @Query("{ '$or': [ { 'clientId': ?0, 'freelancerId': ?1 }, { 'clientId': ?1, 'freelancerId': ?0 } ], 'jobId': ?2 }")
    Optional<Conversation> findByTwoUsersAndJobId(String u1, String u2, String jobId);

    // Tìm kiếm giữa 2 user loại chat trực tiếp (jobId null hoặc không tồn tại)
    @Query("{ '$or': [ { 'clientId': ?0, 'freelancerId': ?1 }, { 'clientId': ?1, 'freelancerId': ?0 } ], '$or': [ { 'jobId': null }, { 'jobId': { '$exists': false } } ] }")
    Optional<Conversation> findByTwoUsersAndJobIdIsNull(String user1, String user2);

    // Tìm cuộc trò chuyện giữa 2 user không theo Job ID
    @Query("{ '$or': [ { 'clientId': ?0, 'freelancerId': ?1 }, { 'clientId': ?1, 'freelancerId': ?0 } ] }")
    Optional<Conversation> findByTwoUsers(String u1, String u2);
}