package be_smart_job.mapper.identity;

import be_smart_job.dto.req.identity.RegisterRequest;
import be_smart_job.dto.res.identity.UserResponse;
import be_smart_job.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "password", ignore = true)
    User toEntity(RegisterRequest request);

    UserResponse toResponse(User user);
}
