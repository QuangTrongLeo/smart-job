package be_smart_job.service.ai.interfaces;

import be_smart_job.dto.res.ai.CvParseResponse;
import org.springframework.web.multipart.MultipartFile;

public interface CvParsingService {
    CvParseResponse parseCvFile(MultipartFile file);
    CvParseResponse parseCvText(String rawCvText);
}