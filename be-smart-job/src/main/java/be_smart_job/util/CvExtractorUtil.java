package be_smart_job.util;

import lombok.extern.slf4j.Slf4j;
import org.apache.tika.Tika;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;

@Slf4j
@Component
public class CvExtractorUtil {

    private final Tika tika = new Tika();

    public String extractTextFromCv(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File CV tải lên không được để trống!");
        }

        try (InputStream inputStream = file.getInputStream()) {
            String extractedText = tika.parseToString(inputStream);
            if (extractedText == null || extractedText.isBlank()) {
                throw new IllegalArgumentException("Không thể đọc được nội dung từ file CV đã tải lên!");
            }
            return extractedText.trim();
        } catch (Exception e) {
            log.error("Lỗi khi dùng Apache Tika trích xuất file CV: ", e);
            throw new RuntimeException("Lỗi trong quá trình đọc nội dung file CV!", e);
        }
    }
}