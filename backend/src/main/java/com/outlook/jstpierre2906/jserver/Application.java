package com.outlook.jstpierre2906.jserver;

import java.io.IOException;
import java.net.InetSocketAddress;

import com.outlook.jstpierre2906.jserver.configs.ServerConfig;
import com.outlook.jstpierre2906.jserver.middleware.ContextsMiddleware;
import com.outlook.jstpierre2906.jserver.middleware.ContextsMiddleware.ContextArgsRecord;
import com.sun.net.httpserver.HttpServer;

public final class Application {
    private static final ServerConfig config = ServerConfig.getInstance();

    private static final String HOST = config.getProperty("host");
    private static final Integer PORT = Integer.parseInt(config.getProperty("port"));
    private static final Integer BACKLOG = Integer.parseInt(config.getProperty("backlog"));
    private static final String URI_ROOT = config.getProperty("uri-root");
    private static final String ALLOWED_ORIGIN = config.getProperty("allowed-origin");

    public static void main(final String[] args) throws IOException {
        final HttpServer server = HttpServer.create(new InetSocketAddress(HOST, PORT), BACKLOG);
        final ContextArgsRecord contextArgs = new ContextArgsRecord(URI_ROOT, ALLOWED_ORIGIN);
        ContextsMiddleware.getAllContexts(contextArgs)
                .entrySet()
                .stream()
                .forEach(context -> server.createContext(context.getKey(), context.getValue()));

        System.out.printf("Server started at %s:%s - URI route is: %s%n", HOST, PORT, URI_ROOT);
        server.start();
    }
}
