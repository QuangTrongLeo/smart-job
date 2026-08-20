package be_smart_job.service.ai.interfaces;

import be_smart_job.dto.req.ai.JobParseReq;
import be_smart_job.dto.res.ai.JobParseResponse;

public interface JobParsingService {
    JobParseResponse parseJobDescription(JobParseReq request);
}