const chromedriver = require('chromedriver');
const HtmlReporter = require('./logger/reporter');

const reporter = new HtmlReporter({
  openBrowser: false,
  reportsDirectory: __dirname + '/reports/html',
  logsDirectory: __dirname + '/reports/logs',
  uniqueFilename: true,
});


module.exports = {
  'page_objects_path': ['page-objects'],
  'webdriver': {
    'start_process': true,
    'server_path': chromedriver.path,
    'port': 9515,
  },

  'globals': {
    reporter: reporter.fn,
  },
  'test_settings': {
    'default': {
      'src_folders': ['tests/scenarios'],
      'desiredCapabilities': {
        'browserName': 'chrome',
        'chromeOptions': {
          'args': [
            // 'headless',
            'no-sandbox', 
            "disable-web-security",
            // "window-size=1920,1080"
          ],
        },
      },
      'skip_testcases_on_fail': false,
    },
    'mobile': {
      'src_folders': ['tests/mobile'],
      'desiredCapabilities': {
        'browserName': 'chrome',
        'chromeOptions': {
          'args': [
            'headless', 
            'no-sandbox', 
            "disable-web-security",
            "disable-gpu", 
            // "window-size=1920,1080"
          ],
          mobileEmulation: {
            deviceMetrics: {width: 375, height: 812, pixelRatio: 3},
            userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/86.0.4240.198',
          }
        },
      },
      'skip_testcases_on_fail': false,
    }
  },
};
