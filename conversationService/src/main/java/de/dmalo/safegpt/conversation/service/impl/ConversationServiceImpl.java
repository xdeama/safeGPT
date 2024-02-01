package de.dmalo.safegpt.conversation.service.impl;

import de.dmalo.safegpt.conversation.domain.Conversation;
import de.dmalo.safegpt.conversation.repository.ConversationRepository;
import de.dmalo.safegpt.conversation.repository.search.ConversationSearchRepository;
import de.dmalo.safegpt.conversation.service.ConversationService;
import de.dmalo.safegpt.conversation.service.dto.ConversationDTO;
import de.dmalo.safegpt.conversation.service.mapper.ConversationMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link de.dmalo.safegpt.conversation.domain.Conversation}.
 */
@Service
@Transactional
public class ConversationServiceImpl implements ConversationService {

    private final Logger log = LoggerFactory.getLogger(ConversationServiceImpl.class);

    private final ConversationRepository conversationRepository;

    private final ConversationMapper conversationMapper;

    private final ConversationSearchRepository conversationSearchRepository;

    public ConversationServiceImpl(
        ConversationRepository conversationRepository,
        ConversationMapper conversationMapper,
        ConversationSearchRepository conversationSearchRepository
    ) {
        this.conversationRepository = conversationRepository;
        this.conversationMapper = conversationMapper;
        this.conversationSearchRepository = conversationSearchRepository;
    }

    @Override
    public ConversationDTO save(ConversationDTO conversationDTO) {
        log.debug("Request to save Conversation : {}", conversationDTO);
        Conversation conversation = conversationMapper.toEntity(conversationDTO);
        conversation = conversationRepository.save(conversation);
        ConversationDTO result = conversationMapper.toDto(conversation);
        conversationSearchRepository.index(conversation);
        return result;
    }

    @Override
    public ConversationDTO update(ConversationDTO conversationDTO) {
        log.debug("Request to update Conversation : {}", conversationDTO);
        Conversation conversation = conversationMapper.toEntity(conversationDTO);
        conversation = conversationRepository.save(conversation);
        ConversationDTO result = conversationMapper.toDto(conversation);
        conversationSearchRepository.index(conversation);
        return result;
    }

    @Override
    public Optional<ConversationDTO> partialUpdate(ConversationDTO conversationDTO) {
        log.debug("Request to partially update Conversation : {}", conversationDTO);

        return conversationRepository
            .findById(conversationDTO.getId())
            .map(existingConversation -> {
                conversationMapper.partialUpdate(existingConversation, conversationDTO);

                return existingConversation;
            })
            .map(conversationRepository::save)
            .map(savedConversation -> {
                conversationSearchRepository.index(savedConversation);
                return savedConversation;
            })
            .map(conversationMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ConversationDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Conversations");
        return conversationRepository.findAll(pageable).map(conversationMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ConversationDTO> findOne(Long id) {
        log.debug("Request to get Conversation : {}", id);
        return conversationRepository.findById(id).map(conversationMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Conversation : {}", id);
        conversationRepository.deleteById(id);
        conversationSearchRepository.deleteFromIndexById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ConversationDTO> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Conversations for query {}", query);
        return conversationSearchRepository.search(query, pageable).map(conversationMapper::toDto);
    }
}
