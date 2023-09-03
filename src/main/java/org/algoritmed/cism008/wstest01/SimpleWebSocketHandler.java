package org.algoritmed.cism008.wstest01;

import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.data.r2dbc.core.R2dbcEntityTemplate;
import org.springframework.web.reactive.socket.WebSocketMessage;
import org.springframework.web.reactive.socket.WebSocketSession;
import reactor.core.publisher.Flux;

public class SimpleWebSocketHandler {
    protected R2dbcEntityTemplate sqlTemplate;

    protected static Flux<String> getStringFlux(WebSocketSession session) {
        return session.receive().map(WebSocketMessage::getPayloadAsText);
    }

    protected Map mapFromString(String value) {
        // logger.info("-22-" + value);
        Map mapIn = null;
        try {
            mapIn = objectMapper.readValue(value, Map.class);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        return mapIn;
    }

    protected String toJsonString(Map mapIn) {
        String jsonStr = null;
        try {
            jsonStr = objectMapper.writeValueAsString(mapIn);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        return jsonStr;
    }

    static AtomicInteger aInt = new AtomicInteger(0);

    ObjectMapper objectMapper = JsonMapper.builder().addModule(new JavaTimeModule()).build();

}
