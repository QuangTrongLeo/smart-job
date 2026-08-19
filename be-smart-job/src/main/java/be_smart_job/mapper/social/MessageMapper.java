package be_smart_job.mapper.social;

import be_smart_job.dto.res.social.MessageResponse;
import be_smart_job.entity.Message;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface MessageMapper {
    MessageResponse toResponse(Message entity);
    List<MessageResponse> toResponseList(List<Message> entities);
}