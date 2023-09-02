package org.algoritmed.cism008.rest;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.algoritmed.cism008.mcrdb.McrDbClient;
import org.algoritmed.cism008.wstest01.Test01WebSocketHandler;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import org.springframework.web.reactive.function.server.ServerResponse.BodyBuilder;
import org.springframework.beans.factory.annotation.Autowired;

import reactor.core.publisher.Mono;
import com.fasterxml.jackson.core.JsonProcessingException;

@Component
public class RestComponent {
    protected static final Logger logger = LoggerFactory.getLogger(RestComponent.class);
    @Autowired
    McrDbClient mcrdbSqlClient;

    private BodyBuilder builderResponse;

    public Mono<ServerResponse> sqlSelect02(ServerRequest request) {
        Map m = new HashMap();
        m.putAll(request.queryParams());
        try {
            mcrdbSqlClient.executeQuery(m);
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
        }
        return builderResponse.body(BodyInserters.fromValue(m));
    }

    public Mono<ServerResponse> rc01(ServerRequest request) {
        Map m = new HashMap();
        m.put("name0", "m1");
        m.putAll(request.queryParams());
        logger.info("-45-" + m);
        return builderResponse.body(BodyInserters.fromValue(m));
    }

    public RestComponent() {
        this.builderResponse = ServerResponse.ok().contentType(MediaType.APPLICATION_JSON);
    }

}
