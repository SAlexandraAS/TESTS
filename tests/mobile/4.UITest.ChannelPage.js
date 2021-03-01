const constants = require('../../constants');
const commonChannelPageTestCase = require('../shared/channelPage.mobile');

module.exports = {
  'before': function(browser) {
    constants.CONFIG_APP.ENABLE_HTTP_AUTH && browser.url(constants.PASS_AUTH_BASE_URL);
  },
  'beforeEach': function(browser) {
    const page = browser.page.channelpage();
    page.navigate();
  },
  '@tags': ['UITestChannelPage'],
  ...commonChannelPageTestCase,
};
