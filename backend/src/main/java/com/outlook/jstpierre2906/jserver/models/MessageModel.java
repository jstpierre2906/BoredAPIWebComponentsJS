package com.outlook.jstpierre2906.jserver.models;

public final class MessageModel {
    Integer id;
    String greeting;
    String quote;

    public MessageModel() {
    }

    public MessageModel(final Integer id, final String greeting, final String quote) {
        this.id = id;
        this.greeting = greeting;
        this.quote = quote;
    }

    public Integer getId() {
        return id;
    }

    public void setId(final Integer id) {
        this.id = id;
    }

    public String getGreeting() {
        return greeting;
    }

    public void setGreeting(final String greeting) {
        this.greeting = greeting;
    }

    public String getQuote() {
        return quote;
    }

    public void setQuote(final String quote) {
        this.quote = quote;
    }
}
