package com.outlook.jstpierre2906.jserver.configs;

import com.outlook.jstpierre2906.propsmanager.PropertiesManager;

public final class ServerConfig {
    private static final String PROPERTIES_FILE = "server.properties";
    private static PropertiesManager propsManager;
    private static ServerConfig instance = null;

    public static ServerConfig getInstance() {
        if (instance == null) {
            propsManager = new PropertiesManager();
            propsManager.loadResourcesProperty(PROPERTIES_FILE);
            instance = new ServerConfig();
        }
        return instance;
    }

    public String getProperty(final String prop) {
        return propsManager.getProperty(prop).orElseThrow();
    }
}
