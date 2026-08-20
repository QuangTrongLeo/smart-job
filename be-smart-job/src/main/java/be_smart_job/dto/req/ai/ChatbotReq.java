package be_smart_job.dto.req.ai;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatbotReq {

    @NotBlank(message = "Nội dung tin nhắn không được để trống")
    private String message;

    private MultipartFile file; // File PDF, DOCX, DOC... (Có thể null nếu không gửi file)
}