package be_smart_job.config;

import be_smart_job.entity.Role;
import be_smart_job.entity.User;
import be_smart_job.enums.RoleType;
import be_smart_job.enums.UserStatus;
import be_smart_job.repository.identity.RoleRepository;
import be_smart_job.repository.identity.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataInitializer {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner initData() {
        return args -> {
            try {
                log.info("--- Starting Data Initialization ---");

                // 1. Khởi tạo danh sách Roles
                initRoles();

                // 2. Khởi tạo danh sách Users mẫu
                initUsers();

                log.info("--- Data Initialization Completed Successfully ---");
            } catch (Exception e) {
                log.error("❌ Error occurred during Data Initialization: ", e);
            }
        };
    }

    private void initRoles() {
        for (RoleType roleType : RoleType.values()) {
            if (!roleRepository.existsByName(roleType)) {
                Role role = Role.builder()
                        .name(roleType)
                        .build();
                roleRepository.save(role);
                log.info("Successfully initialized role: {}", roleType);
            } else {
                log.info("Role already exists: {}", roleType);
            }
        }
    }

    private void initUsers() {
        String defaultPassword = "123456"; // Mật khẩu chung cho tất cả tài khoản khởi tạo

        // 1 Admin Account
        createUserIfNotExist("admin", "admin@smartjob.com", defaultPassword, "System", "Admin", RoleType.ADMIN);

        // 3 Freelancer Accounts
        createUserIfNotExist("freelancer1", "freelancer1@smartjob.com", defaultPassword, "Nguyen", "Van A", RoleType.FREELANCER);
        createUserIfNotExist("freelancer2", "freelancer2@smartjob.com", defaultPassword, "Tran", "Thi B", RoleType.FREELANCER);
        createUserIfNotExist("freelancer3", "freelancer3@smartjob.com", defaultPassword, "Le", "Van C", RoleType.FREELANCER);

        // 3 Client Accounts
        createUserIfNotExist("client1", "client1@smartjob.com", defaultPassword, "Pham", "Van D", RoleType.CLIENT);
        createUserIfNotExist("client2", "client2@smartjob.com", defaultPassword, "Hoang", "Thi E", RoleType.CLIENT);
        createUserIfNotExist("client3", "client3@smartjob.com", defaultPassword, "Vu", "Van F", RoleType.CLIENT);
    }

    private void createUserIfNotExist(String username, String email, String password, String firstName, String lastName, RoleType roleType) {
        if (!userRepository.existsByEmail(email) && !userRepository.existsByUsername(username)) {
            Role role = roleRepository.findByName(roleType)
                    .orElseThrow(() -> new IllegalStateException("Role not found: " + roleType));

            User user = User.builder()
                    .username(username)
                    .email(email)
                    .password(passwordEncoder.encode(password))
                    .firstName(firstName)
                    .lastName(lastName)
                    .roleId(role.getId())
                    .status(UserStatus.ACTIVE)
                    .build();

            userRepository.save(user);
            log.info("Successfully initialized user: [{}] - Role: {}", username, roleType);
        } else {
            log.info("User already exists: [{}]", username);
        }
    }
}