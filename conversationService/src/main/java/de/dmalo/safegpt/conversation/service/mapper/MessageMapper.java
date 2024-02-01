package de.dmalo.safegpt.conversation.service.mapper;

import de.dmalo.safegpt.conversation.domain.Actor;
import de.dmalo.safegpt.conversation.domain.Message;
import de.dmalo.safegpt.conversation.service.dto.ActorDTO;
import de.dmalo.safegpt.conversation.service.dto.MessageDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Message} and its DTO {@link MessageDTO}.
 */
@Mapper(componentModel = "spring")
public interface MessageMapper extends EntityMapper<MessageDTO, Message> {
    @Mapping(target = "repsonse", source = "repsonse", qualifiedByName = "messageId")
    @Mapping(target = "actor", source = "actor", qualifiedByName = "actorId")
    MessageDTO toDto(Message s);

    @Named("messageId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    MessageDTO toDtoMessageId(Message message);

    @Named("actorId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    ActorDTO toDtoActorId(Actor actor);
}
