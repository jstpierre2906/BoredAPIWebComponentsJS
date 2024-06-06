package com.outlook.jstpierre2906.jserver.handlers;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.function.Function;

import com.outlook.jstpierre2906.jserver.middleware.ContextsMiddleware.ContextArgsRecord;
import com.outlook.jstpierre2906.jserver.middleware.ContextsMiddleware.MethodAllowedEnum;
import com.outlook.jstpierre2906.jserver.middleware.ContextsMiddleware.StatusCodeEnum;
import com.outlook.jstpierre2906.jserver.middleware.HeadersMiddleware;
import com.outlook.jstpierre2906.jserver.middleware.StreamWriterMiddleware;
import com.outlook.jstpierre2906.jserver.repositories.MessagesRepository;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

// curl -i -X GET 'http://127.0.0.1:9000/api/v0.9.0/message/1/'
// curl -i -X POST \
//  -u "foobar123":"2Bd)4F;1f6" \
//  -H 'X-App-Token: 7bb32bde85626fa824f1fac46b8c37ba' \
//  -d '{ "greeting": "Buongiorno Mundo", "quote": "Hey hey" }' \
//  'http://127.0.0.1:9000/api/v0.9.0/message/'
public final class MessageHandler extends AbstractHandler {
    public static final String URI_PART = "message";

    private static final List<MethodAllowedEnum> ALLOWED_METHODS = List.of(
            MethodAllowedEnum.GET,
            MethodAllowedEnum.POST);
    private static final String PARAM = "(\\d/)?";
    private static final Function<String, String> getURI = uriRoot -> String.format(
            "^%s/%s/%s$", uriRoot, URI_PART, PARAM);

    private final record InitialStatusArgs(
            ContextArgsRecord contextArgs, HttpExchange exchange, HeadersMiddleware headers) {
    }

    private static final Function<InitialStatusArgs, InitialStatusEnum> setInitialStatus = args -> {
        if (!uriMatches.test(getURI.apply(args.contextArgs().uriRoot()), args.exchange())) {
            return InitialStatusEnum.NOT_FOUND;
        }
        if (methodNotAllowed.test(ALLOWED_METHODS, args.exchange())) {
            return InitialStatusEnum.METHOD_NOT_ALLOWED;
        }
        if (MethodAllowedEnum.POST.toString().equals(args.exchange().getRequestMethod())) {
            if (Boolean.FALSE.equals(args.headers().userCredentialsAreValid())) {
                return InitialStatusEnum.UNAUTHORIZED;
            }
            if (Boolean.FALSE.equals(args.headers().requestTokenIsValid())) {
                return InitialStatusEnum.FORBIDDEN;
            }
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
                    final InitialStatusEnum initialStatus = setInitialStatus.apply(new InitialStatusArgs(
                            contextArgs, exchange, headers));
                    switch (initialStatus) {
                        case NOT_FOUND -> streamWriter.handleResponse(StatusCodeEnum.CODE_404);
                        case METHOD_NOT_ALLOWED -> streamWriter.handleResponse(ALLOWED_METHODS);
                        case UNAUTHORIZED -> streamWriter.handleResponse(StatusCodeEnum.CODE_401);
                        case FORBIDDEN -> streamWriter.handleResponse(StatusCodeEnum.CODE_403);
                        default -> {
                            final Optional<String> response = switch (exchange.getRequestMethod()) {
                                case "POST" -> MessagesRepository.create(exchange);
                                default -> MessagesRepository.find(exchange);
                            };
                            if (response.isPresent()) {
                                streamWriter.handleResponse(response.get(), StatusCodeEnum.CODE_200);
                                return;
                            }
                            streamWriter.handleResponse(StatusCodeEnum.CODE_404);
                        }
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
        return new Handler();
    };

    public MessageHandler() {
        setHandlerFn(handler);
    }
}
