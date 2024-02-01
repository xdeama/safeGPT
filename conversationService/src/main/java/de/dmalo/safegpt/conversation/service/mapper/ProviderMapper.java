package de.dmalo.safegpt.conversation.service.mapper;

import de.dmalo.safegpt.conversation.domain.Provider;
import de.dmalo.safegpt.conversation.service.dto.ProviderDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Provider} and its DTO {@link ProviderDTO}.
 */
@Mapper(componentModel = "spring")
public interface ProviderMapper extends EntityMapper<ProviderDTO, Provider> {}
