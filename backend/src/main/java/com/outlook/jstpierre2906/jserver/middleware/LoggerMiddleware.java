package com.outlook.jstpierre2906.jserver.middleware;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.StringJoiner;
import java.util.function.BiConsumer;

import com.sun.net.httpserver.HttpExchange;

public final class LoggerMiddleware {
    public static final BiConsumer<HttpExchange, Integer> log = (exchange, statusCode) -> {
        final List<String> headersKeys = new ArrayList<>();
        final StringJoiner customHeaders = new StringJoiner(", ", "Headers: ", "");
        exchange.getRequestHeaders()
                .entrySet()
                .stream()
                .filter(entry -> entry.getKey().startsWith("X-"))
                .peek(entry -> headersKeys.add(entry.getKey()))
                .map(entry -> String.format("%s:%s", entry.getKey(), entry.getValue()))
                .forEach(customHeaders::add);

        System.out.printf(
                "%s - %s %s %s %s %s%n",
                new Date(),
                statusCode,
                exchange.getRequestMethod(),
                exchange.getRequestURI(),
                exchange.getRemoteAddress().getHostString(),
                headersKeys.isEmpty() ? "" : customHeaders.toString());
    };

    private LoggerMiddleware() {
    }
}
