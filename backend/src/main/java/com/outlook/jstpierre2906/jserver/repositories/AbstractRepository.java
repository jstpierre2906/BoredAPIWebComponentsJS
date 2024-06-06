package com.outlook.jstpierre2906.jserver.repositories;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.List;
import java.util.Optional;
import java.util.function.BiConsumer;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import com.outlook.jstpierre2906.jserver.configs.ServerConfig;
import com.outlook.jstpierre2906.jserver.middleware.ContextsMiddleware.MethodAllowedEnum;
import com.outlook.jstpierre2906.jserver.models.MessageModel;
import com.outlook.jstpierre2906.jsonobjectmapper.JSONObjectMapper;
import com.sun.net.httpserver.HttpExchange;

abstract sealed class AbstractRepository permits MessagesRepository {
    protected final record QueryPart(String key, String value) {
    }

    protected final record QueryPartMatcher(QueryPart queryPart, String itemArgument, String itemKey) {
    }

    protected static final String DATASTORE = ServerConfig.getInstance().getProperty("datastore");
    protected static final JSONObjectMapper mapper = new JSONObjectMapper();
    protected static final Function<HttpExchange, Optional<List<QueryPart>>> setQueryParts = exchange -> {
        final Optional<String> query = Optional.ofNullable(exchange.getRequestURI().getQuery());
        if (query.isEmpty()) {
            return Optional.empty();
        }
        final List<QueryPart> parts = List.of(query.get().split("&"))
                .stream()
                .map(keyValuePairs -> {
                    final List<String> pair = List.of(keyValuePairs.split("="));
                    return new QueryPart(pair.get(0), pair.get(1));
                })
                .toList();
        return parts.isEmpty() ? Optional.empty() : Optional.of(parts);
    };
    protected static final Predicate<QueryPartMatcher> queryPartMatcherPredicate = matcher -> {
        final Boolean queryKeyEqualsItemKey = matcher.queryPart.key().equals(matcher.itemKey);
        final Boolean itemValueContainsQueryValue = matcher.itemArgument.toLowerCase().contains(
                matcher.queryPart.value().toLowerCase());
        return queryKeyEqualsItemKey && itemValueContainsQueryValue;
    };
    protected static final Function<HttpExchange, Optional<Integer>> setParam = exchange -> {
        final Function<String, String> removeTrailingSlash = uri -> uri.substring(0, uri.lastIndexOf("/"));
        final Function<String, Optional<Integer>> getParamIntegerFromURI = uri -> {
            final String param = uri.substring(uri.lastIndexOf("/") + 1);
            return Pattern.matches("\\d+", param)
                    ? Optional.of(Integer.parseInt(param))
                    : Optional.empty();
        };
        final String uri = removeTrailingSlash.apply(exchange.getRequestURI().toString());
        return getParamIntegerFromURI.apply(uri);
    };
    protected static final Function<HttpExchange, Optional<MessageModel>> setMessage = exchange -> {
        Optional<MessageModel> message = Optional.empty();
        final Predicate<Optional<MessageModel>> messageAndPOSTMethod = optionalMessage -> optionalMessage.isPresent()
                && exchange.getRequestMethod().equals(MethodAllowedEnum.POST.toString());
        final BiConsumer<Optional<MessageModel>, List<MessageModel>> setNewMessageId = (optionalMessage, messages) -> {
            final Integer nextId = messages.size() + 1;
            optionalMessage.get().setId(nextId);
        };
        try {
            final InputStreamReader isr = new InputStreamReader(exchange.getRequestBody());
            final BufferedReader br = new BufferedReader(isr);
            final String requestBody = br
                    .lines()
                    .collect(Collectors.joining("\n"));
            message = Optional.of(mapper.getFromString(requestBody, MessageModel.class));
            if (messageAndPOSTMethod.test(message)) {
                final List<MessageModel> messages = List.of(mapper.getFromFile(
                        DATASTORE,
                        MessageModel[].class));
                setNewMessageId.accept(message, messages);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return message;
    };

    protected AbstractRepository() {
    }
}
