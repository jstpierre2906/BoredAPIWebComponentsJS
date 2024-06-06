package com.outlook.jstpierre2906.jserver.handlers;

import java.io.IOException;
import java.util.List;
import java.util.function.Function;

import com.outlook.jstpierre2906.jserver.middleware.ContextsMiddleware.ContextArgsRecord;
import com.outlook.jstpierre2906.jserver.middleware.ContextsMiddleware.MethodAllowedEnum;
import com.outlook.jstpierre2906.jserver.middleware.ContextsMiddleware.StatusCodeEnum;
import com.outlook.jstpierre2906.jserver.middleware.HeadersMiddleware;
import com.outlook.jstpierre2906.jserver.middleware.StreamWriterMiddleware;
import com.outlook.jstpierre2906.jserver.repositories.MessagesRepository;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

// curl -i -X GET 'http://127.0.0.1:9000/api/v0.9.0/messages/?greeting=hello&quote=beautiful'
public final class MessagesHandler extends AbstractHandler {
    public static final String URI_PART = "messages";

    private static final List<MethodAllowedEnum> ALLOWED_METHODS = List.of(MethodAllowedEnum.GET);
    private static final String QUERY = "(\\?((greeting|quote)=[\\w\\d]+&?){1,2})?";
    private static final Function<String, String> getURI = uriRoot -> String.format(
            "^%s/%s/%s$", uriRoot, URI_PART, QUERY);

    private final record InitialStatusArgs(ContextArgsRecord contextArgs, HttpExchange exchange) {
    }

    private static Function<InitialStatusArgs, InitialStatusEnum> setInitialStatus = args -> {
        if (!uriMatches.test(getURI.apply(args.contextArgs().uriRoot()), args.exchange())) {
            return InitialStatusEnum.NOT_FOUND;
        }
        if (methodNotAllowed.test(ALLOWED_METHODS, args.exchange())) {
            return InitialStatusEnum.METHOD_NOT_ALLOWED;
        }
        return InitialStatusEnum.OK;
    };

    private static final Function<ContextArgsRecord, HttpHandler> handler = contextArgs -> {
        class Handler implements HttpHandler {
            @Override
            public void handle(final HttpExchange exchange) {
                final StreamWriterMiddleware streamWriter = new StreamWriterMiddleware(exchange);
                final HeadersMiddleware headers = new HeadersMiddleware(exchange, contextArgs.allowedOrigin());
                headers.setCommonHeaders();
                try {
                    final InitialStatusEnum initialStatus = setInitialStatus
                            .apply(new InitialStatusArgs(contextArgs, exchange));
                    switch (initialStatus) {
                        case NOT_FOUND ->
                            streamWriter.handleResponse(StatusCodeEnum.CODE_404);
                        case METHOD_NOT_ALLOWED ->
                            streamWriter.handleResponse(ALLOWED_METHODS);
                        default ->
                            streamWriter.handleResponse(
                                    MessagesRepository.findAll(exchange),
                                    StatusCodeEnum.CODE_200);
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
        return new Handler();
    };

    public MessagesHandler() {
        setHandlerFn(handler);
    }
}
