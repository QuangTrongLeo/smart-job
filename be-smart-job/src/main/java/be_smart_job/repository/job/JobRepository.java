package be_smart_job.repository.job;

import be_smart_job.entity.Job;
import be_smart_job.enums.JobStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends MongoRepository<Job, String> {
    Page<Job> findByStatus(JobStatus status, Pageable pageable);
    List<Job> findByClientId(String clientId);
    Page<Job> findByCategoryIdAndStatus(String categoryId, JobStatus status, Pageable pageable);
}
