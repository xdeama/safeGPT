package de.dmalo.safegpt.conversation.service.impl;

import de.dmalo.safegpt.conversation.domain.Provider;
import de.dmalo.safegpt.conversation.repository.ProviderRepository;
import de.dmalo.safegpt.conversation.service.ProviderService;
import de.dmalo.safegpt.conversation.service.dto.ProviderDTO;
import de.dmalo.safegpt.conversation.service.mapper.ProviderMapper;
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
 * Service Implementation for managing {@link de.dmalo.safegpt.conversation.domain.Provider}.
 */
@Service
@Transactional
public class ProviderServiceImpl implements ProviderService {

    private final Logger log = LoggerFactory.getLogger(ProviderServiceImpl.class);

    private final ProviderRepository providerRepository;

    private final ProviderMapper providerMapper;

    public ProviderServiceImpl(ProviderRepository providerRepository, ProviderMapper providerMapper) {
        this.providerRepository = providerRepository;
        this.providerMapper = providerMapper;
    }

    @Override
    public ProviderDTO save(ProviderDTO providerDTO) {
        log.debug("Request to save Provider : {}", providerDTO);
        Provider provider = providerMapper.toEntity(providerDTO);
        provider = providerRepository.save(provider);
        return providerMapper.toDto(provider);
    }

    @Override
    public ProviderDTO update(ProviderDTO providerDTO) {
        log.debug("Request to update Provider : {}", providerDTO);
        Provider provider = providerMapper.toEntity(providerDTO);
        provider = providerRepository.save(provider);
        return providerMapper.toDto(provider);
    }

    @Override
    public Optional<ProviderDTO> partialUpdate(ProviderDTO providerDTO) {
        log.debug("Request to partially update Provider : {}", providerDTO);

        return providerRepository
            .findById(providerDTO.getId())
            .map(existingProvider -> {
                providerMapper.partialUpdate(existingProvider, providerDTO);

                return existingProvider;
            })
            .map(providerRepository::save)
            .map(providerMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProviderDTO> findAll() {
        log.debug("Request to get all Providers");
        return providerRepository.findAll().stream().map(providerMapper::toDto).collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     *  Get all the providers where Conversation is {@code null}.
     *  @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<ProviderDTO> findAllWhereConversationIsNull() {
        log.debug("Request to get all providers where Conversation is null");
        return StreamSupport
            .stream(providerRepository.findAll().spliterator(), false)
            .filter(provider -> provider.getConversation() == null)
            .map(providerMapper::toDto)
            .collect(Collectors.toCollection(LinkedList::new));
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ProviderDTO> findOne(Long id) {
        log.debug("Request to get Provider : {}", id);
        return providerRepository.findById(id).map(providerMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Provider : {}", id);
        providerRepository.deleteById(id);
    }
}
