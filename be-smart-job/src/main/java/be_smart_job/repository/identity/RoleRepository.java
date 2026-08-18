package be_smart_job.repository.identity;

import be_smart_job.entity.Role;
import be_smart_job.enums.RoleType;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends MongoRepository<Role, String> {
    Optional<Role> findByName(RoleType name);
    boolean existsByName(RoleType name);
}
