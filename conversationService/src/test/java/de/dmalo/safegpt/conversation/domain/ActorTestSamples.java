package de.dmalo.safegpt.conversation.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class ActorTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Actor getActorSample1() {
        return new Actor().id(1L).name("name1");
    }

    public static Actor getActorSample2() {
        return new Actor().id(2L).name("name2");
    }

    public static Actor getActorRandomSampleGenerator() {
        return new Actor().id(longCount.incrementAndGet()).name(UUID.randomUUID().toString());
    }
}
