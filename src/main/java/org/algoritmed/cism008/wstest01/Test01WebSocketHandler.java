package org.algoritmed.cism008.wstest01;

import java.util.Map;
import java.util.function.Function;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.r2dbc.core.R2dbcEntityTemplate;
import org.springframework.web.reactive.socket.WebSocketHandler;
import org.springframework.web.reactive.socket.WebSocketMessage;
import org.springframework.web.reactive.socket.WebSocketSession;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public class Test01WebSocketHandler extends SimpleWebSocketHandler implements WebSocketHandler {
    protected static final Logger logger = LoggerFactory.getLogger(Test01WebSocketHandler.class);

    @Override
    public Mono<Void> handle(WebSocketSession session) {
        Function<? super String, ? extends WebSocketMessage> mapper = jsonString -> {
            Map mapIn = mapFromString(jsonString);
            logger.info("-24-" + mapIn);
            if (mapIn.get("cmd") != null) switch (mapIn.get("cmd").toString()) {
                case "insertAdn":
                    insertAdn(mapIn);
                    break;
            }
            mapIn.remove("sql");
            return session.textMessage(toJsonString(mapIn));
        };
        Flux<WebSocketMessage> map = getStringFlux(session).map(mapper);
        return session.send(map);
    }

    private void insertAdn(Map mapIn) {
        logger.info("-41-" + sqlTemplate);
    }
    public Test01WebSocketHandler(R2dbcEntityTemplate sqlTemplate) {
        super();
        this.sqlTemplate = sqlTemplate;
    }

}
