package be_smart_job.mapper.social;

import be_smart_job.dto.res.social.ConversationResponse;
import be_smart_job.entity.Conversation;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ConversationMapper {

    @Mapping(target = "partnerId", ignore = true)
    @Mapping(target = "partnerName", ignore = true)
    @Mapping(target = "partnerAvatar", ignore = true)
    @Mapping(target = "unreadCount", ignore = true)
    ConversationResponse toResponse(Conversation entity);
}