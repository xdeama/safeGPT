package de.dmalo.safegpt.conversation.domain;

import static de.dmalo.safegpt.conversation.domain.ActorTestSamples.*;
import static de.dmalo.safegpt.conversation.domain.MessageTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import de.dmalo.safegpt.conversation.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ActorTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Actor.class);
        Actor actor1 = getActorSample1();
        Actor actor2 = new Actor();
        assertThat(actor1).isNotEqualTo(actor2);

        actor2.setId(actor1.getId());
        assertThat(actor1).isEqualTo(actor2);

        actor2 = getActorSample2();
        assertThat(actor1).isNotEqualTo(actor2);
    }

    @Test
    void messageTest() throws Exception {
        Actor actor = getActorRandomSampleGenerator();
        Message messageBack = getMessageRandomSampleGenerator();

        actor.setMessage(messageBack);
        assertThat(actor.getMessage()).isEqualTo(messageBack);
        assertThat(messageBack.getActor()).isEqualTo(actor);

        actor.message(null);
        assertThat(actor.getMessage()).isNull();
        assertThat(messageBack.getActor()).isNull();
    }
}
