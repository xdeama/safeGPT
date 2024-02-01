package de.dmalo.safegpt.conversation.service;

import de.dmalo.safegpt.conversation.service.dto.ActorDTO;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link de.dmalo.safegpt.conversation.domain.Actor}.
 */
public interface ActorService {
    /**
     * Save a actor.
     *
     * @param actorDTO the entity to save.
     * @return the persisted entity.
     */
    ActorDTO save(ActorDTO actorDTO);

    /**
     * Updates a actor.
     *
     * @param actorDTO the entity to update.
     * @return the persisted entity.
     */
    ActorDTO update(ActorDTO actorDTO);

    /**
     * Partially updates a actor.
     *
     * @param actorDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<ActorDTO> partialUpdate(ActorDTO actorDTO);

    /**
     * Get all the actors.
     *
     * @return the list of entities.
     */
    List<ActorDTO> findAll();

    /**
     * Get all the ActorDTO where Message is {@code null}.
     *
     * @return the {@link List} of entities.
     */
    List<ActorDTO> findAllWhereMessageIsNull();

    /**
     * Get the "id" actor.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<ActorDTO> findOne(Long id);

    /**
     * Delete the "id" actor.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
