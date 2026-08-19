package be_smart_job.repository.social;

import be_smart_job.entity.Message;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends MongoRepository<Message, String> {

    List<Message> findByConversationIdOrderByCreatedAtAsc(String conversationId);

    long countByConversationIdAndReceiverIdAndIsReadFalse(String conversationId, String receiverId);

    List<Message> findByConversationIdAndReceiverIdAndIsReadFalse(String conversationId, String receiverId);
}