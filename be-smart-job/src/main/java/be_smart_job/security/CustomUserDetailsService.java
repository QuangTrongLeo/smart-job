package be_smart_job.security;

import be_smart_job.entity.Role;
import be_smart_job.repository.identity.RoleRepository;
import be_smart_job.repository.identity.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Primary;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Primary
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // 1. Tim User trong DB theo Email
        be_smart_job.entity.User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy người dùng với email: " + email));

        // 2. Tim Role tu roleId trong User
        Role role = roleRepository.findById(user.getRoleId())
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy Role của người dùng"));

        String roleName = role.getName().name(); // Lay ten Enum (CLIENT, FREELANCER, ADMIN)

        // 3. Tra ve UserDetails voi ca 2 quyen ROLE_CLIENT va CLIENT de tuong thich hoan toan voi Spring Security
        return new User(
                user.getEmail(),
                user.getPassword(),
                List.of(
                        new SimpleGrantedAuthority("ROLE_" + roleName),
                        new SimpleGrantedAuthority(roleName)
                )
        );
    }
}