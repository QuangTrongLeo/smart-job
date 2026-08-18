package be_smart_job.config;

import be_smart_job.entity.Role;
import be_smart_job.enums.RoleType;
import be_smart_job.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataInitializer {

    private final RoleRepository roleRepository;

    @Bean
    public CommandLineRunner initRoles() {
        return args -> {
            try {
                log.info("--- Starting Role Initialization ---");
                for (RoleType roleType : RoleType.values()) {
                    if (!roleRepository.existsByName(roleType)) {
                        Role role = Role.builder()
                                .name(roleType)
                                .build();
                        roleRepository.save(role);
                        log.info(" Successfully initialized role: {}", roleType);
                    } else {
                        log.info(" Role already exists: {}", roleType);
                    }
                }
                log.info("--- Role Initialization Completed ---");
            } catch (Exception e) {
                log.error("❌ Error occurred during Role Initialization: ", e);
            }
        };
    }
}