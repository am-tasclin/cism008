package org.algoritmed.cism008.test01;

import org.junit.jupiter.api.Test;
import reactor.core.Disposable;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.Map;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class Test02Parallel {
    @Test
    public void test01() {
//        Map<String, Object> m2 = Stream.of(new Object[][]{
//                {"parent", 376632}, {"cmd", "insertAdn"}
//        }).collect(Collectors.toMap(kv -> (String) kv[0], kv -> (Object) kv[1]));
//        System.out.println(m2);
//        Map<String, Object> m1 = new HashMap<String, Object>();
//        m1.put("parent", 376632);
//        m1.put("cmd", "insertAdn");
//        System.out.println(m1);

        Map<String, Object> m = Map.of(
                "cmd", "insertAdn", "parent", 376632);
        System.out.print("m = ");
        System.out.println(m);

        Flux<String> f = Flux.just("insertAdn", "updateAdn", "deleteAdn");
        f.parallel().filter(s -> s == "insertAdn")
                .doOnNext(System.out::println)
                .subscribe();
    }
}
