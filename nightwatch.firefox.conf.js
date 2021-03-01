const geckodriver = require('geckodriver');
const HtmlReporter = require('./logger/reporter');

const reporter = new HtmlReporter({
  openBrowser: false,
  reportsDirectory: __dirname + '/reports/html',
  logsDirectory: __dirname + '/reports/logs',
  uniqueFilename: true,
});


module.exports = {
  'src_folders': ['tests/scenarios'],
  'page_objects_path': ['page-objects'],
  'webdriver': {
    'start_process': true,
    'server_path': geckodriver.path,
    'port': 9515,
  },

  'globals': {
    reporter: reporter.fn,
  },
  'test_settings': {
    'default': {
      'desiredCapabilities':  {
        'browserName': 'firefox',
        "alwaysMatch": {
          "moz:firefoxOptions": {
            "args": [
              // "-headless"
            ]
          }
        }
      },
      'skip_testcases_on_fail': false,
    },
  },
};