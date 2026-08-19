package be_smart_job.entity;

import lombok.*;
import lombok.experimental.SuperBuilder;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Document(collection = "freelancer_profiles")
public class FreelancerProfile extends BaseEntity {

    @Id
    private String id;

    @Indexed(unique = true)
    @Field("user_id")
    private String userId;

    private String title;                // VD: "Senior Fullstack Developer"
    private String bio;                  // Đoạn văn Giới thiệu
    private Integer yearsOfExperience;   // VD: 5
    private String availabilityStatus;   // VD: "Đang nhận dự án"

    private String address;              // VD: "TP. Hồ Chí Minh (Sẵn sàng Remote)"
    private BigDecimal hourlyRate;       // VD: 30 ($/giờ)
    private String availableHours;       // VD: "30-40 giờ / tuần"

    @Builder.Default
    private List<String> languages = new ArrayList<>(); // VD: ["Tiếng Việt (Bản xứ)", "Tiếng Anh (C1)"]

    // AI & Parsed CV Data
    private String cvUrl;
    private List<String> portfolioUrls;
    private String aiParsedBio;
    private List<Double> vector;

    @Builder.Default
    private Double rating = 0.0;

    @Builder.Default
    private Integer reviewCount = 0;

    @Builder.Default
    private Double completionRate = 0.0;

    @Builder.Default
    private List<String> skills = new ArrayList<>();

    @Builder.Default
    private List<WorkExperience> experiences = new ArrayList<>();
}