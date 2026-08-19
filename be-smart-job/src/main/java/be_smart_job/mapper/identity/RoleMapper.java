package be_smart_job.mapper.identity;

import be_smart_job.dto.req.identity.RoleRequest;
import be_smart_job.dto.res.identity.RoleResponse;
import be_smart_job.entity.Role;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface RoleMapper {
    Role toEntity(RoleRequest request);
    RoleResponse toResponse(Role role);
}