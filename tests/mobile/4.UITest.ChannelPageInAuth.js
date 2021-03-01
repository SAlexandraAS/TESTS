const constants = require('../../constants');
const commonChannelPageTestCase = require('../shared/channelPage.mobile');

module.exports = {
  'before': function(browser) {
    constants.CONFIG_APP.ENABLE_HTTP_AUTH && browser.url(constants.PASS_AUTH_BASE_URL);
    const loginpage = browser.page.loginpage();
    loginpage.navigate();
    loginpage.setInput('@usenameInput', constants.CORRECT_ACC.username);
    loginpage.setInput('@passwordInput', constants.CORRECT_ACC.password);
    loginpage.submitFormLogin();
  },
  'beforeEach': function(browser) {
    const page = browser.page.channelpage();
    page.navigate();
  },
  '@tags': ['UITestChannelPageInAuth'],
  ...commonChannelPageTestCase,
};
