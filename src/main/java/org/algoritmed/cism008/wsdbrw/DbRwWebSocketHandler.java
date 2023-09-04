package org.algoritmed.cism008.wsdbrw;

import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.function.Function;

import org.algoritmed.cism008.mcrdb.Doc;
import org.algoritmed.cism008.mcrdb.Nextdbid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.r2dbc.core.R2dbcEntityTemplate;
import org.springframework.web.reactive.socket.WebSocketHandler;
import org.springframework.web.reactive.socket.WebSocketMessage;
import org.springframework.web.reactive.socket.WebSocketSession;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public class DbRwWebSocketHandler extends SimpleWebSocketHandler implements WebSocketHandler {
    protected static final Logger logger = LoggerFactory.getLogger(DbRwWebSocketHandler.class);

    @Override
    public Mono<Void> handle(WebSocketSession session) {
        Function<? super String, ? extends WebSocketMessage> dbRwAPI = jsonString -> {
            Map mapIn = mapFromString(jsonString);
//            logger.info("-24-" + mapIn);
            if (mapIn.get("cmd") != null)
                try {
                    switch (mapIn.get("cmd").toString()) {
                        case "insertAdn":
                            insertAdn(mapIn);
                            break;
                        case "deleteAdn1":
                            deleteAdn1(mapIn);
                            break;
                        case "executeQuery":
                            executeQuery(mapIn);
                            break;
                    }
                } catch (ExecutionException | InterruptedException e) {
                    throw new RuntimeException(e);
                }
//            mapIn.remove("sql");
            return session.textMessage(toJsonString(mapIn));
        };
        Flux<WebSocketMessage> map = getStringFlux(session).map(dbRwAPI);
        return session.send(map);
    }

    private void deleteAdn1(Map mapIn) throws ExecutionException, InterruptedException {
        Mono<Doc> x = sqlTemplate.delete(new Doc(Long.parseLong(mapIn.get("adnId").toString())));
        mapIn.put("deleted", x.toFuture().get());
        logger.info("-55- " + mapIn);
    }

    private void executeQuery(Map mapIn) throws ExecutionException, InterruptedException {
        String sql = mapIn.get("sql").toString();
        // logger.info("sql -171- \n" + sql);
        List<Map<String, Object>> list = getListOfRowObject(sql).get();
        mapIn.remove("sql");
        logger.info("-63- " + mapIn);
        mapIn.put("list", list);
    }

    private CompletableFuture<List<Map<String, Object>>> getListOfRowObject(String sql) {
        Mono<List<Map<String, Object>>> collectList = sqlClient.sql(sql).fetch().all().collectList();
        CompletableFuture<List<Map<String, Object>>> future = collectList.toFuture();
        return future;
    }

    private void insertAdn(Map mapIn) throws ExecutionException, InterruptedException {
        Doc newDoc = null;
        newDoc = new Doc(nextDbId(), mapIn);
        Mono<Doc> insert = sqlTemplate.insert(newDoc);
        insert.toFuture().get();
        mapIn.put("d", newDoc);
        logger.info("-79- " + mapIn);
    }

    private Long nextDbId() throws InterruptedException, ExecutionException {
        return sqlTemplate.select(Nextdbid.class).first().toFuture().get().getNextval();
    }

    public DbRwWebSocketHandler(R2dbcEntityTemplate sqlTemplate) {
        super();
        this.sqlTemplate = sqlTemplate;
        sqlClient = sqlTemplate.getDatabaseClient();
    }

}
