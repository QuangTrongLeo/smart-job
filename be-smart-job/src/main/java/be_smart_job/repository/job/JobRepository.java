package be_smart_job.repository.job;

import be_smart_job.entity.Job;
import be_smart_job.enums.JobStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends MongoRepository<Job, String> {
    List<Job> findByClientId(String clientId);
    List<Job> findByStatus(JobStatus status);
    List<Job> findByCategoryIdsContaining(String categoryId);
}