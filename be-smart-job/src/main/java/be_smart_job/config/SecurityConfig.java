package be_smart_job.config;

import be_smart_job.security.JwtAuthenticationFilter;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setContentType("application/json;charset=UTF-8");
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            response.getWriter().write("{\"status\": 401, \"message\": \"Chưa xác thực hoặc Token không hợp lệ\"}");
                        })
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // Cho phép truy cập không cần token (khớp cả có /api và không /api)
                        .requestMatchers("/api/auth/**", "/auth/**").permitAll()

                        // Các API yêu cầu xác thực
                        .requestMatchers(
                                "/api/users/my-profile", "/users/my-profile",
                                "/api/jobs/my-jobs", "/jobs/my-jobs",
                                "/api/freelancers/me", "/freelancers/me",
                                "/api/favorites/**", "/favorites/**",
                                "/api/chat/**", "/chat/**"
                        ).authenticated()

                        // Các API GET công khai
                        .requestMatchers(HttpMethod.GET,
                                "/api/users/**", "/users/**",
                                "/api/categories/**", "/categories/**",
                                "/api/jobs/**", "/jobs/**",
                                "/api/enums/**", "/enums/**",
                                "/api/freelancers/**", "/freelancers/**"
                        ).permitAll()

                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}