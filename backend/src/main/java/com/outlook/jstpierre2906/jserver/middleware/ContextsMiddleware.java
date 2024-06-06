package com.outlook.jstpierre2906.jserver.middleware;

import java.util.HashMap;
import java.util.Map;

import com.outlook.jstpierre2906.jserver.handlers.MessageHandler;
import com.outlook.jstpierre2906.jserver.handlers.MessagesHandler;
import com.outlook.jstpierre2906.jserver.handlers.PageNotFoundHandler;
import com.sun.net.httpserver.HttpHandler;

public final class ContextsMiddleware {
    public enum MethodAllowedEnum {
        GET("GET"),
        POST("POST"),
        PUT("PUT"),
        DELETE("DELETE");

        private String method;

        MethodAllowedEnum(final String method) {
            this.method = method;
        }

        @Override
        public String toString() {
            return method;
        }
    }

    final record StatusCodeRecord(Integer code, String label) {
    }

    public enum StatusCodeEnum {
        CODE_200(new StatusCodeRecord(200, "{ 'message': '200 OK' }")),
        CODE_201(new StatusCodeRecord(201, "{ 'message': '201 Created' }")),
        CODE_400(new StatusCodeRecord(400, "{ 'message': '400 Bad Request' }")),
        CODE_401(new StatusCodeRecord(401, "{ 'message': '401 Unauthorized' }")),
        CODE_403(new StatusCodeRecord(403, "{ 'message': '403 Forbidden' }")),
        CODE_404(new StatusCodeRecord(404, "{ 'message': '404 Not Found' }")),
        CODE_405(new StatusCodeRecord(405, "{ 'message': '405 Method Not Allowed - Only %s supported for this uri' }"));

        private StatusCodeRecord statusCodeDef;

        StatusCodeEnum(final StatusCodeRecord statusCodeRecord) {
            this.statusCodeDef = statusCodeRecord;
        }

        public Integer code() {
            return this.statusCodeDef.code();
        }

        public String label() {
            return this.statusCodeDef.label();
        }
    }

    public final record ContextArgsRecord(String uriRoot, String allowedOrigin) {
    }

    public static Map<String, HttpHandler> getAllContexts(final ContextArgsRecord contextArgs) {
        final Map<String, HttpHandler> contextsMap = new HashMap<>();
        contextsMap.put(String.format(
                "%s/%s/",
                contextArgs.uriRoot(),
                MessagesHandler.URI_PART),
                new MessagesHandler().getHandler(contextArgs));
        contextsMap.put(String.format(
                "%s/%s/",
                contextArgs.uriRoot(),
                MessageHandler.URI_PART),
                new MessageHandler().getHandler(contextArgs));
        contextsMap.put("/", new PageNotFoundHandler().getHandler(contextArgs));
        return contextsMap;
    }

    private ContextsMiddleware() {
    }
}
