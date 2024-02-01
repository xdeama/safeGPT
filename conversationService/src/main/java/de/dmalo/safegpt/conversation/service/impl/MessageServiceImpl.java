package de.dmalo.safegpt.conversation.service.impl;

import de.dmalo.safegpt.conversation.domain.Message;
import de.dmalo.safegpt.conversation.repository.MessageRepository;
import de.dmalo.safegpt.conversation.repository.search.MessageSearchRepository;
import de.dmalo.safegpt.conversation.service.MessageService;
import de.dmalo.safegpt.conversation.service.dto.MessageDTO;
import de.dmalo.safegpt.conversation.service.mapper.MessageMapper;
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
 * Service Implementation for managing {@link de.dmalo.safegpt.conversation.domain.Message}.
 */
@Service
@Transactional
public class MessageServiceImpl implements MessageService {

    private final Logger log = LoggerFactory.getLogger(MessageServiceImpl.class);

    private final MessageRepository messageRepository;

    private final MessageMapper messageMapper;

    private final MessageSearchRepository messageSearchRepository;

    public MessageServiceImpl(
        MessageRepository messageRepository,
        MessageMapper messageMapper,
        MessageSearchRepository messageSearchRepository
    ) {
        this.messageRepository = messageRepository;
        this.messageMapper = messageMapper;
        this.messageSearchRepository = messageSearchRepository;
    }

    @Override
    public MessageDTO save(MessageDTO messageDTO) {
        log.debug("Request to save Message : {}", messageDTO);
        Message message = messageMapper.toEntity(messageDTO);
        message = messageRepository.save(message);
        MessageDTO result = messageMapper.toDto(message);
        messageSearchRepository.index(message);
        return result;
    }

    @Override
    public MessageDTO update(MessageDTO messageDTO) {
        log.debug("Request to update Message : {}", messageDTO);
        Message message = messageMapper.toEntity(messageDTO);
        message = messageRepository.save(message);
        MessageDTO result = messageMapper.toDto(message);
        messageSearchRepository.index(message);
        return result;
    }

    @Override
    public Optional<MessageDTO> partialUpdate(MessageDTO messageDTO) {
        log.debug("Request to partially update Message : {}", messageDTO);

        return messageRepository
            .findById(messageDTO.getId())
            .map(existingMessage -> {
                messageMapper.partialUpdate(existingMessage, messageDTO);

                return existingMessage;
            })
            .map(messageRepository::save)
            .map(savedMessage -> {
                messageSearchRepository.index(savedMessage);
                return savedMessage;
            })
            .map(messageMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MessageDTO> findAll() {
        log.debug("Request to get all Messages");
        return messageRepository.findAll().stream().map(messageMapper::toDto).collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     *  Get all the messages where Message is {@code null}.
     *  @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<MessageDTO> findAllWhereMessageIsNull() {
        log.debug("Request to get all messages where Message is null");
        return StreamSupport
            .stream(messageRepository.findAll().spliterator(), false)
            .filter(message -> message.getMessage() == null)
            .map(messageMapper::toDto)
            .collect(Collectors.toCollection(LinkedList::new));
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<MessageDTO> findOne(Long id) {
        log.debug("Request to get Message : {}", id);
        return messageRepository.findById(id).map(messageMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Message : {}", id);
        messageRepository.deleteById(id);
        messageSearchRepository.deleteFromIndexById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MessageDTO> search(String query) {
        log.debug("Request to search Messages for query {}", query);
        try {
            return StreamSupport.stream(messageSearchRepository.search(query).spliterator(), false).map(messageMapper::toDto).toList();
        } catch (RuntimeException e) {
            throw e;
        }
    }
}
