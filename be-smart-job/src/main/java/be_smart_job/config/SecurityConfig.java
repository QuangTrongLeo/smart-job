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
                        .requestMatchers("/auth/**").permitAll()
                        // Cho phép truy cập công khai Chatbot (nếu muốn), loại trừ /ai/parse-job
                        .requestMatchers(HttpMethod.POST, "/ai/chatbot").permitAll()

                        // Yêu cầu xác thực với các thông tin cá nhân/yêu cầu đăng nhập
                        .requestMatchers(
                                "/users/my-profile",
                                "/jobs/my-jobs",
                                "/freelancers/me",
                                "/favorites/**",
                                "/chat/**"
                        ).authenticated()

                        // Cho phép truy cập công khai các API đọc dữ liệu (Thêm /job-matches/** vào đây)
                        .requestMatchers(HttpMethod.GET,
                                "/users/**",
                                "/categories/**",
                                "/jobs/**",
                                "/enums/**",
                                "/freelancers/**",
                                "/job-matches/**" // <-- BỔ SUNG Ở ĐÂY
                        ).permitAll()

                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}