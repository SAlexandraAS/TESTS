const baseConfig = require('./nightwatch.conf.js');

const config = {
    ...baseConfig,
    webdriver: {
        'start_process': false,
        'host': 'hub.crossbrowsertesting.com',
        'port': 80
    },
};

config.test_settings.default['username'] = 'cyrill@ceek.com';
config.test_settings.default['access_key'] = 'u2c91cfb0363423f';
config.test_settings.default.desiredCapabilities.chromeOptions.args = [];

config.test_settings.firefox = {
    desiredCapabilities: {
        "acceptSslCerts": "1",
        "browserName": "Firefox",
        // "platform": "Headless",
        "version": "84",
        "build": "1.0",
        "javascriptEnabled": "1",
        "name": "Ceek Test",
        "platform" : "Windows 10",
        "record_network" : "false",
        "record_video" : "true"
    }
};


config.test_settings.safari = {
    desiredCapabilities: {
        "acceptSslCerts": "1",
        "browserName": "Safari",
        // "platform": "Headless",
        "version": "14",
        "build": "1.0",
        "javascriptEnabled": "1",
        "name": "Ceek Test",
        "platform" : "macOS 11.0",
        "record_network" : "false",
        "record_video" : "true"
    }
};

// Code to copy seleniumhost/port into test settings
for (var i in config.test_settings) {
    var test_setting = config.test_settings[i];
    test_setting['selenium_host'] = config.webdriver.host;
    test_setting['selenium_port'] = config.webdriver.port;
}

module.exports = config;