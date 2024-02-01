package de.dmalo.safegpt.conversation.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Message.
 */
@Entity
@Table(name = "message")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@org.springframework.data.elasticsearch.annotations.Document(indexName = "message")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Message implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "date", nullable = false)
    private Instant date;

    @Column(name = "text_content")
    @org.springframework.data.elasticsearch.annotations.Field(type = org.springframework.data.elasticsearch.annotations.FieldType.Text)
    private String textContent;

    @Lob
    @Column(name = "image_content")
    private byte[] imageContent;

    @Column(name = "image_content_content_type")
    private String imageContentContentType;

    @JsonIgnoreProperties(value = { "repsonse", "actor", "conversations", "message" }, allowSetters = true)
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(unique = true)
    private Message repsonse;

    @JsonIgnoreProperties(value = { "message" }, allowSetters = true)
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(unique = true)
    private Actor actor;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "message")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @org.springframework.data.annotation.Transient
    @JsonIgnoreProperties(value = { "provider", "message" }, allowSetters = true)
    private Set<Conversation> conversations = new HashSet<>();

    @JsonIgnoreProperties(value = { "repsonse", "actor", "conversations", "message" }, allowSetters = true)
    @OneToOne(fetch = FetchType.LAZY, mappedBy = "repsonse")
    @org.springframework.data.annotation.Transient
    private Message message;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Message id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getDate() {
        return this.date;
    }

    public Message date(Instant date) {
        this.setDate(date);
        return this;
    }

    public void setDate(Instant date) {
        this.date = date;
    }

    public String getTextContent() {
        return this.textContent;
    }

    public Message textContent(String textContent) {
        this.setTextContent(textContent);
        return this;
    }

    public void setTextContent(String textContent) {
        this.textContent = textContent;
    }

    public byte[] getImageContent() {
        return this.imageContent;
    }

    public Message imageContent(byte[] imageContent) {
        this.setImageContent(imageContent);
        return this;
    }

    public void setImageContent(byte[] imageContent) {
        this.imageContent = imageContent;
    }

    public String getImageContentContentType() {
        return this.imageContentContentType;
    }

    public Message imageContentContentType(String imageContentContentType) {
        this.imageContentContentType = imageContentContentType;
        return this;
    }

    public void setImageContentContentType(String imageContentContentType) {
        this.imageContentContentType = imageContentContentType;
    }

    public Message getRepsonse() {
        return this.repsonse;
    }

    public void setRepsonse(Message message) {
        this.repsonse = message;
    }

    public Message repsonse(Message message) {
        this.setRepsonse(message);
        return this;
    }

    public Actor getActor() {
        return this.actor;
    }

    public void setActor(Actor actor) {
        this.actor = actor;
    }

    public Message actor(Actor actor) {
        this.setActor(actor);
        return this;
    }

    public Set<Conversation> getConversations() {
        return this.conversations;
    }

    public void setConversations(Set<Conversation> conversations) {
        if (this.conversations != null) {
            this.conversations.forEach(i -> i.setMessage(null));
        }
        if (conversations != null) {
            conversations.forEach(i -> i.setMessage(this));
        }
        this.conversations = conversations;
    }

    public Message conversations(Set<Conversation> conversations) {
        this.setConversations(conversations);
        return this;
    }

    public Message addConversation(Conversation conversation) {
        this.conversations.add(conversation);
        conversation.setMessage(this);
        return this;
    }

    public Message removeConversation(Conversation conversation) {
        this.conversations.remove(conversation);
        conversation.setMessage(null);
        return this;
    }

    public Message getMessage() {
        return this.message;
    }

    public void setMessage(Message message) {
        if (this.message != null) {
            this.message.setRepsonse(null);
        }
        if (message != null) {
            message.setRepsonse(this);
        }
        this.message = message;
    }

    public Message message(Message message) {
        this.setMessage(message);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Message)) {
            return false;
        }
        return getId() != null && getId().equals(((Message) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Message{" +
            "id=" + getId() +
            ", date='" + getDate() + "'" +
            ", textContent='" + getTextContent() + "'" +
            ", imageContent='" + getImageContent() + "'" +
            ", imageContentContentType='" + getImageContentContentType() + "'" +
            "}";
    }
}
