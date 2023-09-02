package org.algoritmed.cism008.wstest01;

import java.util.Map;
import java.util.function.Function;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.reactive.socket.WebSocketHandler;
import org.springframework.web.reactive.socket.WebSocketMessage;
import org.springframework.web.reactive.socket.WebSocketSession;

import reactor.core.publisher.Mono;

public class Test01WebSocketHandler extends SimpleWebSocketHandler implements WebSocketHandler {
    protected static final Logger logger = LoggerFactory.getLogger(Test01WebSocketHandler.class);

    @Override
    public Mono<Void> handle(WebSocketSession session) {
        Function<? super String, ? extends WebSocketMessage> mapper = jsonString -> {
            Map mapIn = mapFromString(jsonString);
            mapIn.remove("sql");
            mapIn.put("value", 3);
            logger.info("-24-" + mapIn);
            return session.textMessage(toJsonString(mapIn));
        };

        return session.send(makeOutput(session, mapper));
    }
}
