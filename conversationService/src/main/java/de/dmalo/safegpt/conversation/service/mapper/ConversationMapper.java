package de.dmalo.safegpt.conversation.service.mapper;

import de.dmalo.safegpt.conversation.domain.Conversation;
import de.dmalo.safegpt.conversation.domain.Message;
import de.dmalo.safegpt.conversation.domain.Provider;
import de.dmalo.safegpt.conversation.service.dto.ConversationDTO;
import de.dmalo.safegpt.conversation.service.dto.MessageDTO;
import de.dmalo.safegpt.conversation.service.dto.ProviderDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Conversation} and its DTO {@link ConversationDTO}.
 */
@Mapper(componentModel = "spring")
public interface ConversationMapper extends EntityMapper<ConversationDTO, Conversation> {
    @Mapping(target = "provider", source = "provider", qualifiedByName = "providerId")
    @Mapping(target = "message", source = "message", qualifiedByName = "messageId")
    ConversationDTO toDto(Conversation s);

    @Named("providerId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    ProviderDTO toDtoProviderId(Provider provider);

    @Named("messageId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    MessageDTO toDtoMessageId(Message message);
}
