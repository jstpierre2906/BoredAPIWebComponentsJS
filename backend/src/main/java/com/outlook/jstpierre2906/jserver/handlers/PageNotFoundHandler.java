package com.outlook.jstpierre2906.jserver.handlers;

import java.io.IOException;
import java.util.function.Function;

import com.outlook.jstpierre2906.jserver.middleware.ContextsMiddleware.ContextArgsRecord;
import com.outlook.jstpierre2906.jserver.middleware.ContextsMiddleware.StatusCodeEnum;
import com.outlook.jstpierre2906.jserver.middleware.HeadersMiddleware;
import com.outlook.jstpierre2906.jserver.middleware.StreamWriterMiddleware;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

// curl -i -X GET 'http://127.0.0.1:9000/api/v0.9.0/mezzage/1/'
// curl -i -X GET 'http://127.0.0.1:9000/api/v0.9.0/foo'
// curl -i -X GET 'http://127.0.0.1:9000/api/v0.9.0/'
public final class PageNotFoundHandler extends AbstractHandler {
    private static final Function<ContextArgsRecord, HttpHandler> handler = contextArgs -> {
        class Handler implements HttpHandler {
            @Override
            public void handle(final HttpExchange exchange) {
                final StreamWriterMiddleware streamWriter = new StreamWriterMiddleware(exchange);
                final HeadersMiddleware headers = new HeadersMiddleware(exchange, contextArgs.allowedOrigin());
                headers.setCommonHeaders();
                try {
                    streamWriter.handleResponse(StatusCodeEnum.CODE_404);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
        return new Handler();
    };

    public PageNotFoundHandler() {
        setHandlerFn(handler);
    }
}
