package org.algoritmed.cism008;

import java.util.HashMap;
import java.util.Map;

import org.algoritmed.cism008.rest.RestComponent;
import org.algoritmed.cism008.wstest01.Test01WebSocketHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.r2dbc.core.R2dbcEntityTemplate;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.HandlerMapping;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.RouterFunctions;
import org.springframework.web.reactive.function.server.ServerResponse;
import org.springframework.web.reactive.handler.SimpleUrlHandlerMapping;
import org.springframework.web.reactive.socket.WebSocketHandler;

import static org.springframework.web.reactive.function.server.RequestPredicates.GET;
import static org.springframework.web.reactive.function.server.RequestPredicates.POST;
import static org.springframework.web.reactive.function.server.RequestPredicates.accept;

@SpringBootApplication
public class Cism008Application {

    public static void main(String[] args) {
        SpringApplication.run(Cism008Application.class, args);
    }

    @Autowired
    R2dbcEntityTemplate sqlTemplate;
    @Bean
    public HandlerMapping handlerMapping() {
        Map<String, WebSocketHandler> map = new HashMap<>();
        map.put("/test01", new Test01WebSocketHandler(sqlTemplate));

        int order = -1; // before annotated controllers
        return new SimpleUrlHandlerMapping(map, order);
    }

    @Bean
    public RouterFunction<ServerResponse> route(RestComponent restComponent) {
        return RouterFunctions
                .route(GET("rs01").and(accept(MediaType.APPLICATION_JSON)), restComponent::rc01)
                .andRoute(GET("sqlSelect02").and(accept(MediaType.APPLICATION_JSON)), restComponent::sqlSelect02);
    }
}
