package be_smart_job.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

@Configuration
public class CorsConfig {

    // Tiêm giá trị CLIENT_URL từ file .env / application.properties
    @Value("${app.cors.client-url:http://localhost:5173}")
    private String clientUrl;

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();

        // 1. Cho phép gửi Credentials (Cookies, Authorization Headers)
        config.setAllowCredentials(true);

        // 2. Cấu hình Origin được phép truy cập (Lấy từ .env)
        config.setAllowedOrigins(List.of(clientUrl));

        // 3. Các Header được phép gửi lên từ Frontend
        config.setAllowedHeaders(List.of(
                "Origin",
                "Content-Type",
                "Accept",
                "Authorization",
                "X-Requested-With",
                "Access-Control-Request-Method",
                "Access-Control-Request-Headers"
        ));

        // 4. Các Method HTTP được phép gọi
        config.setAllowedMethods(List.of(
                "GET",
                "POST",
                "PUT",
                "DELETE",
                "PATCH",
                "OPTIONS"
        ));

        // 5. Thới gian cache kết quả CORS pre-flight request (tính bằng giây)
        config.setMaxAge(3600L);

        // Áp dụng cấu hình CORS cho tất cả các Endpoints (/api/v1/...)
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
