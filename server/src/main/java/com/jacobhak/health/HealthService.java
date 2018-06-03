package com.jacobhak.health;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.buffer.Buffer;
import io.vertx.core.http.HttpMethod;
import io.vertx.core.http.HttpServerResponse;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.RoutingContext;
import io.vertx.ext.web.client.WebClient;
import io.vertx.ext.web.handler.BodyHandler;
import io.vertx.ext.web.handler.CorsHandler;
    
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.HashSet;
import java.util.UUID;
import java.time.OffsetDateTime;

public class HealthService extends AbstractVerticle {

    private Map<String, JsonObject> services = new HashMap<>();

    @Override
    public void start() {

        setUpInitialData();

        Router router = Router.router(vertx);

        Set<HttpMethod> allowedMethods = new HashSet<HttpMethod>() {{
            add(HttpMethod.GET);
            add(HttpMethod.POST);
            add(HttpMethod.DELETE);
        }};
        Set<String> allowedHeaders = new HashSet<String>() {{
            add("Content-Type");
            add("accept");
        }};
        
        router.route().handler(CorsHandler.create("*").allowedMethods(allowedMethods).allowedHeaders(allowedHeaders));
        router.route().handler(BodyHandler.create());
        router.delete("/services/:serviceID").handler(this::handleDeleteService);
        router.post("/services").handler(this::handleAddService);
        router.get("/services").handler(this::handleListServices);

        vertx.createHttpServer().requestHandler(router::accept).listen(4711);
        vertx.setPeriodic(60000, this::checkHealth);
    }

    private void checkHealth(Long id) {
        services.forEach((k, v) -> {
            String url = v.getString("url");
            WebClient.create(vertx)
                .getAbs(url)
                .timeout(30000)
                .send(ar -> {
                    String status;
                    System.out.println("Got response from " + url);
                    if (ar.succeeded() && ar.result().statusCode() == 200) {
                        status = "OK";
                    } else {
                        status = "FAIL";
                    }
                    v.put("status", status);
                    v.put("lastCheck", OffsetDateTime.now().toString());
                    addService(v);
                });
        });
    }

    private void handleDeleteService(RoutingContext routingContext) {
        String serviceID = routingContext.request().getParam("serviceID");
        HttpServerResponse response = routingContext.response();
        if (serviceID == null) {
            sendError(400, response);
        } else {
            JsonObject service = services.get(serviceID);
            if (service == null) {
                sendError(404, response);
            } else {
                deleteService(service.getString("id"));
                response.putHeader("content-type", "application/json").end();
            }
        }
    }

    private void handleAddService(RoutingContext routingContext) {
        HttpServerResponse response = routingContext.response();
        JsonObject service = routingContext.getBodyAsJson();
        if (service == null || service.getString("name") == null || service.getString("url") == null) {
            sendError(400, response);
        } else {
            service.put("id", UUID.randomUUID().toString());
            addService(service);
            response.end();
        }
    }

    private void handleListServices(RoutingContext routingContext) {
        JsonArray arr = new JsonArray();
        services.forEach((k, v) -> arr.add(v));
        routingContext.response().putHeader("content-type", "application/json").end(arr.encodePrettily());
    }

    private void sendError(int statusCode, HttpServerResponse response) {
        response.setStatusCode(statusCode).end();
    }

    private void setUpInitialData() {
        vertx.fileSystem().readFile("db.json", result -> {
           if (result.succeeded()) {
               JsonArray services = new JsonArray(result.result());
               services.forEach(s -> addService((JsonObject) s));
           } else {
               System.err.println("Failed reading db file: " + result.cause());
           }
        });
    }

    private void persistServices() {
        JsonArray array = new JsonArray();
        services.forEach((k, v) -> array.add(v));
        vertx.fileSystem().writeFile("db.json", Buffer.buffer(array.encodePrettily()), result -> {
            if (result.succeeded()) {
                System.out.println("Persisted successfully");
            } else {
                System.err.println("Failed persisting services: " + result.cause());
            }
        });
    }

    private void addService(JsonObject service) {
        services.put(service.getString("id"), service);
        persistServices();
    }

    private void deleteService(String id) {
        services.remove(id);
        persistServices();
    }
}
