const constants = require('../../constants');
const commonHomePageTestCase = require('../shared/homePage.mobile');

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
    const page = browser.page.homepage();
    page.navigate();
  },
  '@tags': ['UITestHomepageInAuthenticate'],
  ...commonHomePageTestCase,
  '[5] Check if love button show and work': async (browser) => {
    const loveBtn = '.home.mainPage .hero-inner .heroLiked';
    await browser.waitForElementVisible('.home.mainPage .hero-inner .heroLiked', 5000, 'Testing if the love button in hero banner is visible');
    const classListOfCurrentBtnLoveBeforeClick = await browser.getElementProperty('.home.mainPage .hero-inner .heroLiked', 'classList');
    const isbtnHasBeenLiked = classListOfCurrentBtnLoveBeforeClick.value.includes('liked');
    await browser.click(loveBtn);
    browser.pause(1000);
    const classListOfCurrentBtnLoveAfterClick = await browser.getElementProperty('.home.mainPage .hero-inner .heroLiked', 'classList');
    const isbtnHasBeenLikedAfterClick = classListOfCurrentBtnLoveAfterClick.value.includes('liked');
    browser.assert.ok(isbtnHasBeenLiked !== isbtnHasBeenLikedAfterClick, 'Testing if the status of love button has been updated');
  },
};
