package org.algoritmed.cism008.test01;

import org.assertj.core.groups.Tuple;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import reactor.core.Scannable;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.util.function.Tuple2;
import reactor.util.function.Tuples;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;

public class Test01 {
    protected static final Logger logger = LoggerFactory.getLogger(Test01.class);

    @Test
    public void test01() {
        logger.info("-18- " + 123);
        Mono<Integer> tagged1 = Mono.just(1).tag("1", "One").tag("2", "Two");
        Stream<Tuple2<String, String>> scannedTags = Scannable.from(tagged1).tags();
//        Iterator<Tuple2<String, String>> x = scannedTags.iterator();
//        while (x.hasNext()) {
//            Tuple2<String, String> next = x.next();
//            logger.info("-24- " + next);
//        }
        assertThat(scannedTags).containsExactly(Tuples.of("1", "One"), Tuples.of("2", "Two"));
        Flux<Integer> f = Flux.just(1).tag("1", "one").tag("2", "two");
        System.out.println(f);
    }
}
