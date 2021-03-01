const constants = require('../../constants');
const livePageTestCase = require('../shared/livePage.mobile');

module.exports = {
  'before': function(browser) {
    
    constants.CONFIG_APP.ENABLE_HTTP_AUTH && browser.url(constants.PASS_AUTH_BASE_URL);
    const loginPage = browser.page.loginpage();
    loginPage.navigate();
    loginPage.setInput('@usenameInput', constants.CORRECT_ACC.username);
    loginPage.setInput('@passwordInput', constants.CORRECT_ACC.password);
    loginPage.submitFormLogin();
  },
  'beforeEach': function(browser) {
    const page = browser.page.livepage();
    page.navigate();
  },
  '@tags': ['UITestLivepageInAuth'],
  ...livePageTestCase,
};
