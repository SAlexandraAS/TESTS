const constants = require('../../constants');
const discoveryPagePageTestCase = require('../shared/discoveryPage.mobile');

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
    const page = browser.page.discoverypage();
    page.navigate();
  },
  '@tags': ['UITestDiscoverypageInAuth'],
  ...discoveryPagePageTestCase,
  'Check like/unlike works in auth mode': async (browser) => {
    await browser.moveToElement('#videoscreen section.videogrid .videogrid__item:nth-of-type(2)', 10, 10);
    const notlikeBtnEl = await browser.element('css selector', '#videoscreen section.videogrid .videogrid__item:first-of-type .videogrid__actions .stats__item');
    await browser.elementIdClick(Object.values(notlikeBtnEl.value)[0]);
    browser.pause(3000); // Wait api sent
    const notLikeSvg = await browser.elementIdElement(Object.values(notlikeBtnEl.value)[0], 'css selector', 'svg.not-liked');
    const displayPropertyNotLikeBtn = await browser.elementIdCssProperty(Object.values(notLikeSvg.value)[0], 'display');
    const notLikeBtnStatus = displayPropertyNotLikeBtn.value;
    browser.refresh();
    browser.pause(3000);
    const likeBtnVideoInChannelElsAfterRefresh = await browser.element('css selector', '#videoscreen section.videogrid .videogrid__item:first-of-type .videogrid__actions .stats__item');

    const notLikeSvgAfterRefresh = await browser.elementIdElement(Object.values(likeBtnVideoInChannelElsAfterRefresh.value)[0], 'css selector', 'svg.not-liked');
    const displayPropertyNotLikeBtnAfterRefresh = await browser.elementIdCssProperty(Object.values(notLikeSvgAfterRefresh.value)[0], 'display');
    const notLikeBtnStatusAfterRefresh = displayPropertyNotLikeBtnAfterRefresh.value;
    browser.assert.ok(notLikeBtnStatus == notLikeBtnStatusAfterRefresh, 'Like/Unline icon work when user logged-in');
  },
}
;
