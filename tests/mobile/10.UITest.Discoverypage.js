const constants = require('../../constants');
const discoveryPagePageTestCase = require('../shared/discoveryPage.mobile');

module.exports = {
  'before': function(browser) {
    constants.CONFIG_APP.ENABLE_HTTP_AUTH && browser.url(constants.PASS_AUTH_BASE_URL);
  },
  'beforeEach': function(browser) {
    const page = browser.page.discoverypage();
    page.navigate();
  },
  '@tags': ['UITestDiscoverypage'],
  ...discoveryPagePageTestCase,
}
;
