package org.algoritmed.cism008.mcrdb;

import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import reactor.core.publisher.Mono;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.Map;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.r2dbc.core.DatabaseClient;
import org.springframework.data.r2dbc.core.R2dbcEntityTemplate;

@Component
public class McrDbClient {
    protected static final Logger logger = LoggerFactory.getLogger(McrDbClient.class);
    DatabaseClient sqlClient;

    public McrDbClient(@Autowired R2dbcEntityTemplate sqlTemplate) {
        this.sqlClient = sqlTemplate.getDatabaseClient();
    }

    public void executeQuery(Map map) throws InterruptedException, ExecutionException {
        String sql = (String) ((List) map.get("sql")).get(0);
        logger.info("-15- sql " + sql.length());
        List<Map<java.lang.String, Object>> list = getListOfRowObject(sql).get();
        map.remove("sql");
        map.put("list", list);
    }

    public CompletableFuture<List<Map<String, Object>>> getListOfRowObject(String sql) {
        Mono<List<Map<String, Object>>> collectList = sqlClient.sql(sql).fetch().all().collectList();
        CompletableFuture<List<Map<String, Object>>> future = collectList.toFuture();
        return future;
    }

}
