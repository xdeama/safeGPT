package de.dmalo.safegpt.conversation.service.impl;

import de.dmalo.safegpt.conversation.domain.Actor;
import de.dmalo.safegpt.conversation.repository.ActorRepository;
import de.dmalo.safegpt.conversation.service.ActorService;
import de.dmalo.safegpt.conversation.service.dto.ActorDTO;
import de.dmalo.safegpt.conversation.service.mapper.ActorMapper;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link de.dmalo.safegpt.conversation.domain.Actor}.
 */
@Service
@Transactional
public class ActorServiceImpl implements ActorService {

    private final Logger log = LoggerFactory.getLogger(ActorServiceImpl.class);

    private final ActorRepository actorRepository;

    private final ActorMapper actorMapper;

    public ActorServiceImpl(ActorRepository actorRepository, ActorMapper actorMapper) {
        this.actorRepository = actorRepository;
        this.actorMapper = actorMapper;
    }

    @Override
    public ActorDTO save(ActorDTO actorDTO) {
        log.debug("Request to save Actor : {}", actorDTO);
        Actor actor = actorMapper.toEntity(actorDTO);
        actor = actorRepository.save(actor);
        return actorMapper.toDto(actor);
    }

    @Override
    public ActorDTO update(ActorDTO actorDTO) {
        log.debug("Request to update Actor : {}", actorDTO);
        Actor actor = actorMapper.toEntity(actorDTO);
        actor = actorRepository.save(actor);
        return actorMapper.toDto(actor);
    }

    @Override
    public Optional<ActorDTO> partialUpdate(ActorDTO actorDTO) {
        log.debug("Request to partially update Actor : {}", actorDTO);

        return actorRepository
            .findById(actorDTO.getId())
            .map(existingActor -> {
                actorMapper.partialUpdate(existingActor, actorDTO);

                return existingActor;
            })
            .map(actorRepository::save)
            .map(actorMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ActorDTO> findAll() {
        log.debug("Request to get all Actors");
        return actorRepository.findAll().stream().map(actorMapper::toDto).collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     *  Get all the actors where Message is {@code null}.
     *  @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<ActorDTO> findAllWhereMessageIsNull() {
        log.debug("Request to get all actors where Message is null");
        return StreamSupport
            .stream(actorRepository.findAll().spliterator(), false)
            .filter(actor -> actor.getMessage() == null)
            .map(actorMapper::toDto)
            .collect(Collectors.toCollection(LinkedList::new));
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ActorDTO> findOne(Long id) {
        log.debug("Request to get Actor : {}", id);
        return actorRepository.findById(id).map(actorMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Actor : {}", id);
        actorRepository.deleteById(id);
    }
}
