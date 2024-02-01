package de.dmalo.safegpt.conversation.service;

import de.dmalo.safegpt.conversation.service.dto.ProviderDTO;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link de.dmalo.safegpt.conversation.domain.Provider}.
 */
public interface ProviderService {
    /**
     * Save a provider.
     *
     * @param providerDTO the entity to save.
     * @return the persisted entity.
     */
    ProviderDTO save(ProviderDTO providerDTO);

    /**
     * Updates a provider.
     *
     * @param providerDTO the entity to update.
     * @return the persisted entity.
     */
    ProviderDTO update(ProviderDTO providerDTO);

    /**
     * Partially updates a provider.
     *
     * @param providerDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<ProviderDTO> partialUpdate(ProviderDTO providerDTO);

    /**
     * Get all the providers.
     *
     * @return the list of entities.
     */
    List<ProviderDTO> findAll();

    /**
     * Get all the ProviderDTO where Conversation is {@code null}.
     *
     * @return the {@link List} of entities.
     */
    List<ProviderDTO> findAllWhereConversationIsNull();

    /**
     * Get the "id" provider.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<ProviderDTO> findOne(Long id);

    /**
     * Delete the "id" provider.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
