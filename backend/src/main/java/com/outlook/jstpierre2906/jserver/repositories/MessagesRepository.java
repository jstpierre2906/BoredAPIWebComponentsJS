package com.outlook.jstpierre2906.jserver.repositories;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.function.Predicate;

import com.outlook.jstpierre2906.jserver.models.MessageModel;
import com.sun.net.httpserver.HttpExchange;

public final class MessagesRepository extends AbstractRepository {
    public static String findAll(final HttpExchange exchange) {
        final Optional<List<QueryPart>> queryParts = setQueryParts.apply(exchange);
        final Predicate<MessageModel> queryMatcher = item -> {
            if (!queryParts.isPresent()) {
                return true;
            }
            final List<QueryPart> queryPartsList = queryParts.get();
            final List<QueryPart> matches = new ArrayList<>();
            queryPartsList
                    .stream()
                    .forEach(queryPart -> {
                        if (queryPartMatcherPredicate.test(new QueryPartMatcher(
                                queryPart,
                                item.getGreeting(),
                                "greeting"))) {
                            matches.add(queryPart);
                        }
                        if (queryPartMatcherPredicate.test(new QueryPartMatcher(
                                queryPart,
                                item.getQuote(),
                                "quote"))) {
                            matches.add(queryPart);
                        }
                    });
            return matches.size() == queryPartsList.size();
        };
        String result = "";
        try {
            final List<MessageModel> messages = List.of(mapper
                    .getFromFile(DATASTORE, MessageModel[].class))
                    .stream()
                    .filter(queryMatcher::test)
                    .toList();
            result = mapper.toJSONString(messages);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return result;
    }

    public static Optional<String> find(final HttpExchange exchange) {
        Optional<String> result = Optional.empty();
        final Optional<Integer> param = setParam.apply(exchange);
        if (param.isEmpty()) {
            return result;
        }
        final Predicate<MessageModel> paramMatcher = item -> item.getId().equals(param.get());
        try {
            final Optional<MessageModel> message = List.of(mapper
                    .getFromFile(DATASTORE, MessageModel[].class))
                    .stream()
                    .filter(paramMatcher::test)
                    .findFirst();
            if (message.isPresent()) {
                result = Optional.of(mapper.toJSONString(message.get()));
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return result;
    }

    public static Optional<String> create(final HttpExchange exchange) {
        Optional<String> result = Optional.empty();

        Optional<MessageModel> message = setMessage.apply(exchange);
        if (message.isPresent()) {
            System.out.println(message.get().getId());
            System.out.println(message.get().getGreeting());
            System.out.println(message.get().getQuote());
        }

        return Optional.empty();
    }

    private MessagesRepository() {
    }
}
