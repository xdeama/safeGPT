package de.dmalo.safegpt.conversation.domain;

import static de.dmalo.safegpt.conversation.domain.ActorTestSamples.*;
import static de.dmalo.safegpt.conversation.domain.ConversationTestSamples.*;
import static de.dmalo.safegpt.conversation.domain.MessageTestSamples.*;
import static de.dmalo.safegpt.conversation.domain.MessageTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import de.dmalo.safegpt.conversation.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class MessageTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Message.class);
        Message message1 = getMessageSample1();
        Message message2 = new Message();
        assertThat(message1).isNotEqualTo(message2);

        message2.setId(message1.getId());
        assertThat(message1).isEqualTo(message2);

        message2 = getMessageSample2();
        assertThat(message1).isNotEqualTo(message2);
    }

    @Test
    void repsonseTest() throws Exception {
        Message message = getMessageRandomSampleGenerator();
        Message messageBack = getMessageRandomSampleGenerator();

        message.setRepsonse(messageBack);
        assertThat(message.getRepsonse()).isEqualTo(messageBack);

        message.repsonse(null);
        assertThat(message.getRepsonse()).isNull();
    }

    @Test
    void actorTest() throws Exception {
        Message message = getMessageRandomSampleGenerator();
        Actor actorBack = getActorRandomSampleGenerator();

        message.setActor(actorBack);
        assertThat(message.getActor()).isEqualTo(actorBack);

        message.actor(null);
        assertThat(message.getActor()).isNull();
    }

    @Test
    void conversationTest() throws Exception {
        Message message = getMessageRandomSampleGenerator();
        Conversation conversationBack = getConversationRandomSampleGenerator();

        message.addConversation(conversationBack);
        assertThat(message.getConversations()).containsOnly(conversationBack);
        assertThat(conversationBack.getMessage()).isEqualTo(message);

        message.removeConversation(conversationBack);
        assertThat(message.getConversations()).doesNotContain(conversationBack);
        assertThat(conversationBack.getMessage()).isNull();

        message.conversations(new HashSet<>(Set.of(conversationBack)));
        assertThat(message.getConversations()).containsOnly(conversationBack);
        assertThat(conversationBack.getMessage()).isEqualTo(message);

        message.setConversations(new HashSet<>());
        assertThat(message.getConversations()).doesNotContain(conversationBack);
        assertThat(conversationBack.getMessage()).isNull();
    }

    @Test
    void messageTest() throws Exception {
        Message message = getMessageRandomSampleGenerator();
        Message messageBack = getMessageRandomSampleGenerator();

        message.setMessage(messageBack);
        assertThat(message.getMessage()).isEqualTo(messageBack);
        assertThat(messageBack.getRepsonse()).isEqualTo(message);

        message.message(null);
        assertThat(message.getMessage()).isNull();
        assertThat(messageBack.getRepsonse()).isNull();
    }
}
