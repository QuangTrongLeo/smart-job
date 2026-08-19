package be_smart_job.dto.req.identity;

import be_smart_job.enums.RoleType;
import lombok.Data;

@Data
public class RoleRequest {
    private RoleType name;
}