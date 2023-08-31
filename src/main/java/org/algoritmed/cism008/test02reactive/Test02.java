package org.algoritmed.cism008.test02reactive;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public class Test02 {
    protected static final Logger logger = LoggerFactory.getLogger(Test02.class);

    public static void main(String[] args) {
        Mono<String> justMonoString = Mono.just("foo");
        logger.info("-10- Hi Test02 " + justMonoString.block());
        // Flux<Integer> x = Flux.just(1, 2, 3, 4, 5);
        Flux<Integer> x = Flux.range(5, 6);

        logger.info("-14-" + x);
        // List<Integer> elements = new ArrayList<>();
        // logger.info("-21-" + elements);
        // x.subscribe(elements::add);
        // Mono<List<Integer>> x0 = x.collectList();
        // List<Integer> x1 = x0.block();
        // logger.info("-23-" + x1);
        // x.log()
        // // .map(i -> i * 2)
        // // .subscribe(elements::add)
        // .filter(v -> v % 2 == 0);
        Flux<Object> x2 = x.map(v -> v * v);
        Mono<List<Object>> x3 = x2.collectList();
        List<Object> x4 = x3.block();
        logger.info("-28-" + x4);
        Flux.just(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
                // .limitRequest(5)
                .take(6,true)
                .skip(3)
                .subscribe(value -> System.out.println("Value: " + value));
    }
}
