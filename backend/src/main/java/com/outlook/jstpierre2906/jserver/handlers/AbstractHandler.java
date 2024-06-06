package com.outlook.jstpierre2906.jserver.handlers;

import java.util.List;
import java.util.Optional;
import java.util.function.BiPredicate;
import java.util.function.Function;
import java.util.regex.Pattern;

import com.outlook.jstpierre2906.jserver.middleware.ContextsMiddleware.ContextArgsRecord;
import com.outlook.jstpierre2906.jserver.middleware.ContextsMiddleware.MethodAllowedEnum;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

abstract sealed class AbstractHandler
        permits MessageHandler, MessagesHandler, PageNotFoundHandler {

    protected static final BiPredicate<List<MethodAllowedEnum>, HttpExchange> methodNotAllowed = (
            methodsAllowed, exchange) -> {
        Optional<MethodAllowedEnum> methodAllowed = methodsAllowed
                .stream()
                .filter(method -> method.toString().equals(exchange.getRequestMethod()))
                .findFirst();
        return methodAllowed.isEmpty();
    };

    protected static final BiPredicate<String, HttpExchange> uriMatches = (regex, exchange) -> Pattern.matches(
            regex,
            exchange.getRequestURI().toString());

    protected enum InitialStatusEnum {
        OK, CREATED, BAD_REQUEST, UNAUTHORIZED, FORBIDDEN, NOT_FOUND, METHOD_NOT_ALLOWED
    }

    protected Function<ContextArgsRecord, HttpHandler> handlerFn;

    public HttpHandler getHandler(final ContextArgsRecord contextArgs) {
        return handlerFn.apply(contextArgs);
    }

    protected void setHandlerFn(final Function<ContextArgsRecord, HttpHandler> handlerFn) {
        this.handlerFn = handlerFn;
    }
}
