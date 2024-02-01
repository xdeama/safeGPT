package de.dmalo.safegpt.conversation.service.mapper;

import de.dmalo.safegpt.conversation.domain.Actor;
import de.dmalo.safegpt.conversation.service.dto.ActorDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Actor} and its DTO {@link ActorDTO}.
 */
@Mapper(componentModel = "spring")
public interface ActorMapper extends EntityMapper<ActorDTO, Actor> {}
