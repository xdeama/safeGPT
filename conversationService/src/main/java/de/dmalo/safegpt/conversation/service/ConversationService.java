package de.dmalo.safegpt.conversation.service;

import de.dmalo.safegpt.conversation.service.dto.ConversationDTO;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link de.dmalo.safegpt.conversation.domain.Conversation}.
 */
public interface ConversationService {
    /**
     * Save a conversation.
     *
     * @param conversationDTO the entity to save.
     * @return the persisted entity.
     */
    ConversationDTO save(ConversationDTO conversationDTO);

    /**
     * Updates a conversation.
     *
     * @param conversationDTO the entity to update.
     * @return the persisted entity.
     */
    ConversationDTO update(ConversationDTO conversationDTO);

    /**
     * Partially updates a conversation.
     *
     * @param conversationDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<ConversationDTO> partialUpdate(ConversationDTO conversationDTO);

    /**
     * Get all the conversations.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<ConversationDTO> findAll(Pageable pageable);

    /**
     * Get the "id" conversation.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<ConversationDTO> findOne(Long id);

    /**
     * Delete the "id" conversation.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);

    /**
     * Search for the conversation corresponding to the query.
     *
     * @param query the query of the search.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<ConversationDTO> search(String query, Pageable pageable);
}
