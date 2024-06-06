package com.outlook.jstpierre2906.jserver.middleware;

import java.io.IOException;
import java.io.OutputStream;
import java.util.List;
import java.util.StringJoiner;
import java.util.function.Supplier;

import com.outlook.jstpierre2906.jserver.middleware.ContextsMiddleware.MethodAllowedEnum;
import com.outlook.jstpierre2906.jserver.middleware.ContextsMiddleware.StatusCodeEnum;
import com.sun.net.httpserver.HttpExchange;

public final class StreamWriterMiddleware {
    private HttpExchange exchange;

    public StreamWriterMiddleware(final HttpExchange exchange) {
        this.exchange = exchange;
    }

    public void handleResponse(final StatusCodeEnum statusCodeEnum) throws IOException {
        final Integer code = statusCodeEnum.code();
        final String label = statusCodeEnum.label();
        exchange.sendResponseHeaders(code, label.length());
        logAndWrite(code, label);
    }

    public void handleResponse(final List<MethodAllowedEnum> allowedMethods) throws IOException {
        final Supplier<String> methodsAllowed = () -> {
            final StringJoiner joiner = new StringJoiner(", ");
            allowedMethods
                    .stream()
                    .forEach(method -> joiner.add(method.toString()));
            return String.format(StatusCodeEnum.CODE_405.label(), joiner.toString());
        };
        final Integer code = StatusCodeEnum.CODE_405.code();
        final String label = methodsAllowed.get();
        exchange.sendResponseHeaders(code, label.length());
        logAndWrite(code, label);
    }

    public void handleResponse(final String response, final StatusCodeEnum statusCodeEnum) throws IOException {
        final Integer code = statusCodeEnum.code();
        exchange.sendResponseHeaders(code, response.length());
        logAndWrite(code, response);
    }

    private void logAndWrite(final Integer code, final String response) throws IOException {
        final OutputStream stream = exchange.getResponseBody();
        LoggerMiddleware.log.accept(exchange, code);
        stream.write(response.getBytes());
        stream.close();
    }
}
