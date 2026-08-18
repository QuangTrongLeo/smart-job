package be_smart_job.repository.job;

import be_smart_job.entity.Category;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends MongoRepository<Category, String> {
    Optional<Category> findBySlug(String slug);
    List<Category> findByParentId(String parentId);
    boolean existsByName(String name);
    boolean existsBySlug(String slug);
}
