package be_smart_job.service.identity.interfaces;

import be_smart_job.dto.req.identity.RoleRequest;
import be_smart_job.dto.res.identity.RoleResponse;

import java.util.List;

public interface RoleService {
    List<RoleResponse> getAllRoles();
    RoleResponse getRoleById(String id);
    RoleResponse createRole(RoleRequest request);
}