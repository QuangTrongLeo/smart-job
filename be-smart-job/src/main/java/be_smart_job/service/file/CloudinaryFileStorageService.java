package be_smart_job.service.file;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CloudinaryFileStorageService implements FileStorageService {

    private final Cloudinary cloudinary;

    @Override
    public String upload(MultipartFile file, String folder) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File không được để trống");
        }
        try {
            String publicId = folder + "/" + UUID.randomUUID();
            Map<?, ?> uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "public_id", publicId,
                            "resource_type", "auto" // Tự động nhận diện ảnh, video, pdf,...
                    )
            );
            return uploadResult.get("secure_url").toString();
        } catch (IOException e) {
            throw new IllegalStateException("Upload file lên Cloudinary thất bại", e);
        }
    }

    @Override
    public void deleteByUrl(String fileUrl) {
        if (fileUrl == null || fileUrl.trim().isEmpty()) {
            return;
        }
        try {
            String publicId = extractPublicId(fileUrl);
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (Exception ignored) {
            // Log hoặc bỏ qua nếu không tìm thấy file để xóa
        }
    }

    private String extractPublicId(String url) {
        // Tách lấy public_id (bao gồm cả folder) từ URL của Cloudinary
        // VD: https://res.cloudinary.com/demo/image/upload/v1234567890/folder/uuid.jpg -> folder/uuid
        int uploadIndex = url.indexOf("/upload/");
        if (uploadIndex == -1) return "";

        String pathAfterUpload = url.substring(uploadIndex + 8); // Bỏ qua '/upload/'

        // Bỏ phần version (v1234567890/) nếu có
        if (pathAfterUpload.startsWith("v") && pathAfterUpload.contains("/")) {
            pathAfterUpload = pathAfterUpload.substring(pathAfterUpload.indexOf("/") + 1);
        }

        // Bỏ đuôi mở rộng (.jpg, .png,...)
        int lastDotIndex = pathAfterUpload.lastIndexOf(".");
        if (lastDotIndex != -1) {
            pathAfterUpload = pathAfterUpload.substring(0, lastDotIndex);
        }

        return pathAfterUpload;
    }
}