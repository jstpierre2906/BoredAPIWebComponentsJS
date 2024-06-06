package com.outlook.jstpierre2906.jserver.middleware;

import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Optional;
import java.util.function.BiConsumer;
import java.util.function.Consumer;
import java.util.function.Supplier;

import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;

public final class HeadersMiddleware {
    private static final String HEADER_TOKEN_KEY = "X-App-Token";
    private static final String MOCK_REQUEST_TOKEN = "7bb32bde85626fa824f1fac46b8c37ba";
    private static final String MOCK_USERNAME = "foobar123";
    private static final String MOCK_PASSWORD = "2Bd)4F;1f6";

    private static final Consumer<Headers> setJSONResponseHeader = headers -> headers.set("Content-Type",
            "application/json; charset=UTF-8");

    private static final Consumer<Headers> setXPoweredByResponseHeader = headers -> headers.set("X-Powered-By",
            "com.sun.net.httpserver.HttpServer");

    private static final BiConsumer<Headers, String> setAccessControlAllowOriginHeader = (
            headers,
            origin) -> headers.set("Access-Control-Allow-Origin", origin);

    private final HttpExchange exchange;
    private final String allowedOrigin;

    public HeadersMiddleware(final HttpExchange exchange, final String allowedOrigin) {
        this.exchange = exchange;
        this.allowedOrigin = allowedOrigin;
    }

    public void setCommonHeaders() {
        setJSONResponseHeader
                .andThen(setXPoweredByResponseHeader)
                .accept(exchange.getResponseHeaders());
        setAccessControlAllowOriginHeader.accept(exchange.getResponseHeaders(), allowedOrigin);
    }

    public Boolean userCredentialsAreValid() {
        final Map<String, Boolean> matches = new HashMap<>();
        matches.put("username", Boolean.FALSE);
        matches.put("password", Boolean.FALSE);
        Optional.ofNullable(exchange.getRequestHeaders().getFirst("Authorization")).ifPresent(authHeader -> {
            final String authorizationHashStart = "Basic ";
            if (!authHeader.startsWith(authorizationHashStart)) {
                return;
            }
            final record Credentials(String username, String password) {
            }
            final Supplier<Optional<Credentials>> buildCredentials = () -> {
                final String hashedCredentials = authHeader.substring(authorizationHashStart.length());
                final List<String> credentialsParts = List.of(new String(
                        Base64.getDecoder().decode(hashedCredentials))
                        .split(":"));
                return credentialsParts.size() != 2
                        ? Optional.empty()
                        : Optional.of(new Credentials(credentialsParts.get(0), credentialsParts.get(1)));
            };
            buildCredentials.get().ifPresent(credentials -> matches.entrySet()
                    .stream()
                    .forEach(entry -> {
                        if (entry.getKey().equals("username")) {
                            entry.setValue(MOCK_USERNAME.equals(credentials.username()));
                        }
                        if (entry.getKey().equals("password")) {
                            entry.setValue(MOCK_PASSWORD.equals(credentials.password()));
                        }
                    }));
        });
        return matches.entrySet().stream().allMatch(Entry::getValue);
    }

    public Boolean requestTokenIsValid() {
        final Optional<List<String>> values = exchange.getRequestHeaders().entrySet()
                .stream()
                .filter(entry -> entry.getKey().toLowerCase().equals(HEADER_TOKEN_KEY.toLowerCase()))
                .map(entry -> entry.getValue())
                .findFirst();

        if (values.isEmpty()) {
            return false;
        }
        return values.get()
                .stream()
                .map(String::toLowerCase)
                .anyMatch(value -> value.equals(MOCK_REQUEST_TOKEN.toLowerCase()));
    }
}
