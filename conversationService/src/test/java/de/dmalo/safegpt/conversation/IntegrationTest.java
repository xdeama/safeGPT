package de.dmalo.safegpt.conversation;

import de.dmalo.safegpt.conversation.config.AsyncSyncConfiguration;
import de.dmalo.safegpt.conversation.config.EmbeddedElasticsearch;
import de.dmalo.safegpt.conversation.config.EmbeddedKafka;
import de.dmalo.safegpt.conversation.config.EmbeddedRedis;
import de.dmalo.safegpt.conversation.config.EmbeddedSQL;
import de.dmalo.safegpt.conversation.config.TestSecurityConfiguration;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;

/**
 * Base composite annotation for integration tests.
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@SpringBootTest(classes = { ConversationServiceApp.class, AsyncSyncConfiguration.class, TestSecurityConfiguration.class })
@EmbeddedRedis
@EmbeddedElasticsearch
@EmbeddedSQL
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
@EmbeddedKafka
public @interface IntegrationTest {
}
