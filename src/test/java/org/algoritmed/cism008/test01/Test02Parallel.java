package org.algoritmed.cism008.test01;

import org.junit.jupiter.api.Test;
import reactor.core.publisher.Flux;

import java.util.HashMap;
import java.util.Map;

public class Test02Parallel {
    @Test
    public void test01() {
        Map<String, Object> m = new HashMap<String, Object>();
        m.put("parent", 376632);
        m.put("cmd", "insertAdn");
        System.out.println(m);
        Flux<String> f = Flux.just("insertAdn", "updateAdn", "deleteAdn");
        System.out.println(f);
        f.log().parallel().subscribe();
    }


}
