package be_smart_job;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BeSmartJobApplication {

    public static void main(String[] args) {
        // Nạp biến môi trường từ file .env vào System Properties trước khi Spring khởi chạy
        Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
        dotenv.entries().forEach(entry -> {
            System.setProperty(entry.getKey(), entry.getValue());
        });

        SpringApplication.run(BeSmartJobApplication.class, args);
    }
}