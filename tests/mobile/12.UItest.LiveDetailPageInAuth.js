const constants = require('../../constants');
const commonTestCase = require('../shared/liveDetailPage');

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
    const page = browser.page.livedetailpage();
    page.navigate();
  },
  '@tags': ['UITestLiveDetailpageInAuth'],
  ...commonTestCase,
  'Check if love shown and works in AUTH': async (browser) => {
    browser.assert.visible('.hero-info__stats .heroVideoLike');
    const btnLike = '.hero-info__stats .heroVideoLike svg.icon-stats:not(.hidden)';
    const getClassNameOfBtnBeforeClick = await browser.getElementProperty(btnLike, 'classList');
    const videoHasbeenLikedBeforeClick = getClassNameOfBtnBeforeClick.value.includes('liked');

    await browser.click('.hero-info__stats .heroVideoLike');
    browser.pause(2000);
    const getClassNameOfBtnAfterClick = await browser.getElementProperty(btnLike, 'classList');
    const videoHasbeenLikedAfterClick = getClassNameOfBtnAfterClick.value.includes('liked');

    browser.assert.ok(videoHasbeenLikedBeforeClick !== videoHasbeenLikedAfterClick, 'Testing if status btn like has been changed');
  },
}
;
