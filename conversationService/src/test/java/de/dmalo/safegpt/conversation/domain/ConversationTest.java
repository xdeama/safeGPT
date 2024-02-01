package de.dmalo.safegpt.conversation.domain;

import static de.dmalo.safegpt.conversation.domain.ConversationTestSamples.*;
import static de.dmalo.safegpt.conversation.domain.MessageTestSamples.*;
import static de.dmalo.safegpt.conversation.domain.ProviderTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import de.dmalo.safegpt.conversation.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ConversationTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Conversation.class);
        Conversation conversation1 = getConversationSample1();
        Conversation conversation2 = new Conversation();
        assertThat(conversation1).isNotEqualTo(conversation2);

        conversation2.setId(conversation1.getId());
        assertThat(conversation1).isEqualTo(conversation2);

        conversation2 = getConversationSample2();
        assertThat(conversation1).isNotEqualTo(conversation2);
    }

    @Test
    void providerTest() throws Exception {
        Conversation conversation = getConversationRandomSampleGenerator();
        Provider providerBack = getProviderRandomSampleGenerator();

        conversation.setProvider(providerBack);
        assertThat(conversation.getProvider()).isEqualTo(providerBack);

        conversation.provider(null);
        assertThat(conversation.getProvider()).isNull();
    }

    @Test
    void messageTest() throws Exception {
        Conversation conversation = getConversationRandomSampleGenerator();
        Message messageBack = getMessageRandomSampleGenerator();

        conversation.setMessage(messageBack);
        assertThat(conversation.getMessage()).isEqualTo(messageBack);

        conversation.message(null);
        assertThat(conversation.getMessage()).isNull();
    }
}
