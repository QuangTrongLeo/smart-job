package be_smart_job.service.file;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
    String upload(MultipartFile file, String folder);
    void deleteByUrl(String fileUrl);
}
