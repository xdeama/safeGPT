package de.dmalo.safegpt.conversation.service.dto;

import jakarta.persistence.Lob;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

/**
 * A DTO for the {@link de.dmalo.safegpt.conversation.domain.Message} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class MessageDTO implements Serializable {

    private Long id;

    @NotNull
    private Instant date;

    private String textContent;

    @Lob
    private byte[] imageContent;

    private String imageContentContentType;
    private MessageDTO repsonse;

    private ActorDTO actor;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getDate() {
        return date;
    }

    public void setDate(Instant date) {
        this.date = date;
    }

    public String getTextContent() {
        return textContent;
    }

    public void setTextContent(String textContent) {
        this.textContent = textContent;
    }

    public byte[] getImageContent() {
        return imageContent;
    }

    public void setImageContent(byte[] imageContent) {
        this.imageContent = imageContent;
    }

    public String getImageContentContentType() {
        return imageContentContentType;
    }

    public void setImageContentContentType(String imageContentContentType) {
        this.imageContentContentType = imageContentContentType;
    }

    public MessageDTO getRepsonse() {
        return repsonse;
    }

    public void setRepsonse(MessageDTO repsonse) {
        this.repsonse = repsonse;
    }

    public ActorDTO getActor() {
        return actor;
    }

    public void setActor(ActorDTO actor) {
        this.actor = actor;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof MessageDTO)) {
            return false;
        }

        MessageDTO messageDTO = (MessageDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, messageDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "MessageDTO{" +
            "id=" + getId() +
            ", date='" + getDate() + "'" +
            ", textContent='" + getTextContent() + "'" +
            ", imageContent='" + getImageContent() + "'" +
            ", repsonse=" + getRepsonse() +
            ", actor=" + getActor() +
            "}";
    }
}
