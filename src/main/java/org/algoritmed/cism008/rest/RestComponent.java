package org.algoritmed.cism008.rest;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import org.springframework.web.reactive.function.server.ServerResponse.BodyBuilder;

import reactor.core.publisher.Mono;

@Component
public class RestComponent {
    private BodyBuilder builderResponse;

    public Mono<ServerResponse> rc01(ServerRequest request) {
        Map m = new HashMap();
        m.put("name0", "m1");
        m.putAll(request.queryParams());
        return sendResponse(m);
    }

    private Mono<ServerResponse> sendResponse(Map m) {
        return builderResponse.body(BodyInserters.fromValue(m));
    }

    public RestComponent() {
        this.builderResponse = ServerResponse.ok().contentType(MediaType.APPLICATION_JSON);
    }

}
