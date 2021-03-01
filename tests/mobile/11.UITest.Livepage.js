const constants = require('../../constants');
const livePageTestCase = require('../shared/livePage.mobile');

module.exports = {
  'before': function(browser) {
    constants.CONFIG_APP.ENABLE_HTTP_AUTH && browser.url(constants.PASS_AUTH_BASE_URL);
  },
  'beforeEach': function(browser) {
    const page = browser.page.livepage();
    page.navigate();
  },
  '@tags': ['UITestLivepage'],
  ...livePageTestCase,
};
