const constants = require('../../constants');
const commonHomePageTestCase = require('../shared/homePage.mobile');

module.exports = {
  'before': function(browser) { 
    constants.CONFIG_APP.ENABLE_HTTP_AUTH && browser.url(constants.PASS_AUTH_BASE_URL);
  },
  'beforeEach': function(browser) {
    const page = browser.page.homepage();
    page.navigate();
  },
  '@tags': ['UITestHomepage'],
  ...commonHomePageTestCase,
  'Check if love button show and work': async (browser) => {
    await browser.waitForElementVisible('.home.mainPage .hero-inner .heroLiked', 5000, 'Testing if the love button in hero banner is visible');
    await browser.click('.home.mainPage .hero-inner .heroLiked');
    await browser.waitForElementVisible('.swal2-popup.swal2-modal.swal2-show', 5000, 'Testing if the modal login has been show');
    const titleOfModalLogin = await browser.getText('.swal2-popup.swal2-modal.swal2-show .swal2-title');
    browser.assert.equal(titleOfModalLogin.value, 'Please log in to continue', 'Testing if love button work when no login');
  },
};
