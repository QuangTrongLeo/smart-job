package be_smart_job.controller.common;

import be_smart_job.dto.res.ApiResponse;
import be_smart_job.enums.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/enums")
public class EnumController {

    @GetMapping("/currencies")
    public ResponseEntity<ApiResponse<List<CurrencyType>>> getCurrencies() {
        return ResponseEntity.ok(ApiResponse.of(HttpStatus.OK.value(), "Lấy danh sách Currency success", Arrays.asList(CurrencyType.values())));
    }

    @GetMapping("/employment-types")
    public ResponseEntity<ApiResponse<List<EmploymentType>>> getEmploymentTypes() {
        return ResponseEntity.ok(ApiResponse.of(HttpStatus.OK.value(), "Lấy danh sách EmploymentType success", Arrays.asList(EmploymentType.values())));
    }

    @GetMapping("/experience-levels")
    public ResponseEntity<ApiResponse<List<ExperienceLevel>>> getExperienceLevels() {
        return ResponseEntity.ok(ApiResponse.of(HttpStatus.OK.value(), "Lấy danh sách ExperienceLevel success", Arrays.asList(ExperienceLevel.values())));
    }

    @GetMapping("/job-statuses")
    public ResponseEntity<ApiResponse<List<JobStatus>>> getJobStatuses() {
        return ResponseEntity.ok(ApiResponse.of(HttpStatus.OK.value(), "Lấy danh sách JobStatus success", Arrays.asList(JobStatus.values())));
    }

    @GetMapping("/match-statuses")
    public ResponseEntity<ApiResponse<List<MatchStatus>>> getMatchStatuses() {
        return ResponseEntity.ok(ApiResponse.of(HttpStatus.OK.value(), "Lấy danh sách MatchStatus success", Arrays.asList(MatchStatus.values())));
    }

    @GetMapping("/role-types")
    public ResponseEntity<ApiResponse<List<RoleType>>> getRoleTypes() {
        return ResponseEntity.ok(ApiResponse.of(HttpStatus.OK.value(), "Lấy danh sách RoleType success", Arrays.asList(RoleType.values())));
    }

    @GetMapping("/user-statuses")
    public ResponseEntity<ApiResponse<List<UserStatus>>> getUserStatuses() {
        return ResponseEntity.ok(ApiResponse.of(HttpStatus.OK.value(), "Lấy danh sách UserStatus success", Arrays.asList(UserStatus.values())));
    }

    // API lấy toàn bộ danh sách Enums trong 1 request duy nhất (tiện cho Frontend load ban đầu)
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAllEnums() {
        Map<String, Object> allEnums = new HashMap<>();
        allEnums.put("currencies", CurrencyType.values());
        allEnums.put("employmentTypes", EmploymentType.values());
        allEnums.put("experienceLevels", ExperienceLevel.values());
        allEnums.put("jobStatuses", JobStatus.values());
        allEnums.put("matchStatuses", MatchStatus.values());
        allEnums.put("roleTypes", RoleType.values());
        allEnums.put("userStatuses", UserStatus.values());

        return ResponseEntity.ok(ApiResponse.of(HttpStatus.OK.value(), "Lấy tất cả Enums thành công", allEnums));
    }
}