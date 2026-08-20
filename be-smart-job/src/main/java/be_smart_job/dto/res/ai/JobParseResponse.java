package be_smart_job.dto.res.ai;

import be_smart_job.enums.EmploymentType;
import be_smart_job.enums.ExperienceLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobParseResponse {

    private String aiParsedDesc;            // Văn bản đã sửa lỗi chính tả & chuẩn hóa ngữ pháp
    private List<String> requiredSkills;   // Danh sách các kỹ năng bóc tách được (vd: Java, React, MongoDB)
    private ExperienceLevel experienceLevel; // Enum kinh nghiệm dự đoán (INTERN, JUNIOR, MIDDLE, SENIOR, EXPERT)
    private Integer requiredExperienceYears; // Số năm kinh nghiệm dự đoán
    private EmploymentType employmentType;   // Enum hình thức làm việc (FULL_TIME, PART_TIME, FREELANCE, REMOTE, HYBRID)
}