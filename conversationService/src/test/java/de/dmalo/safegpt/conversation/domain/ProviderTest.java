package de.dmalo.safegpt.conversation.domain;

import static de.dmalo.safegpt.conversation.domain.ConversationTestSamples.*;
import static de.dmalo.safegpt.conversation.domain.ProviderTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import de.dmalo.safegpt.conversation.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ProviderTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Provider.class);
        Provider provider1 = getProviderSample1();
        Provider provider2 = new Provider();
        assertThat(provider1).isNotEqualTo(provider2);

        provider2.setId(provider1.getId());
        assertThat(provider1).isEqualTo(provider2);

        provider2 = getProviderSample2();
        assertThat(provider1).isNotEqualTo(provider2);
    }

    @Test
    void conversationTest() throws Exception {
        Provider provider = getProviderRandomSampleGenerator();
        Conversation conversationBack = getConversationRandomSampleGenerator();

        provider.setConversation(conversationBack);
        assertThat(provider.getConversation()).isEqualTo(conversationBack);
        assertThat(conversationBack.getProvider()).isEqualTo(provider);

        provider.conversation(null);
        assertThat(provider.getConversation()).isNull();
        assertThat(conversationBack.getProvider()).isNull();
    }
}
