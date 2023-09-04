package org.algoritmed.cism008.wsdbrw;

import java.io.IOException;
import java.util.Map;
import java.util.function.BiConsumer;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.reactive.socket.WebSocketHandler;
import org.springframework.web.reactive.socket.WebSocketMessage;
import org.springframework.web.reactive.socket.WebSocketSession;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.publisher.SynchronousSink;

public class Test01WebSocketHandler01 extends SimpleWebSocketHandler implements WebSocketHandler {
    protected static final Logger logger = LoggerFactory.getLogger(Test01WebSocketHandler01.class);

    @Override
    public Mono<Void> handle(WebSocketSession session) {
// https://stackoverflow.com/questions/69414037/how-to-convert-spring-boot-websocket-text-message-to-custom-java-object-bean-or

// work as read with JS: ws.send(JSON.stringify({ x: 1, y: 2 }))

        BiConsumer<? super WebSocketMessage, SynchronousSink<Object>> handler = (webSocketMessage, synchronousSink) -> {
            try {
                Map myObject = objectMapper.readValue(
                        webSocketMessage.getPayload().asInputStream().readAllBytes(),
                        Map.class);
                synchronousSink.next(myObject);
            } catch (IOException e) {
                synchronousSink.error(e);
            }
        };
        Flux<Object> output = session.receive().handle(handler);
        Flux<Map> p = output.cast(Map.class).log();
        return p.then();
    }

}