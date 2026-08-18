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
            Arrays.stream(RoleType.values()).forEach(roleType -> {
                if (!roleRepository.existsByName(roleType)) {
                    Role role = Role.builder()
                            .name(roleType)
                            .build();
                    roleRepository.save(role);
                    log.info("Initialized role: {}", roleType);
                }
            });
        };
    }
}