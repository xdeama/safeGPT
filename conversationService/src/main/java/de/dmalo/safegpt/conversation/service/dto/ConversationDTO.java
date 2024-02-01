package de.dmalo.safegpt.conversation.service.dto;

import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

/**
 * A DTO for the {@link de.dmalo.safegpt.conversation.domain.Conversation} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ConversationDTO implements Serializable {

    private Long id;

    @NotNull
    private Instant startDate;

    private ProviderDTO provider;

    private MessageDTO message;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getStartDate() {
        return startDate;
    }

    public void setStartDate(Instant startDate) {
        this.startDate = startDate;
    }

    public ProviderDTO getProvider() {
        return provider;
    }

    public void setProvider(ProviderDTO provider) {
        this.provider = provider;
    }

    public MessageDTO getMessage() {
        return message;
    }

    public void setMessage(MessageDTO message) {
        this.message = message;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ConversationDTO)) {
            return false;
        }

        ConversationDTO conversationDTO = (ConversationDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, conversationDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ConversationDTO{" +
            "id=" + getId() +
            ", startDate='" + getStartDate() + "'" +
            ", provider=" + getProvider() +
            ", message=" + getMessage() +
            "}";
    }
}
