const constants = require('../../constants');
const commonChannelDetailPageTestCase = require('../shared/channelDetailPage.mobile');

module.exports = {
  'before': async (browser) => {
    constants.CONFIG_APP.ENABLE_HTTP_AUTH && browser.url(constants.PASS_AUTH_BASE_URL);
    const loginPage = browser.page.loginpage();
    loginPage.navigate();
    loginPage.setInput('@usenameInput', constants.CORRECT_ACC.username);
    loginPage.setInput('@passwordInput', constants.CORRECT_ACC.password);
    loginPage.submitFormLogin();
  },
  'beforeEach': function(browser) {
    browser.url(`${constants.CHANNEL_PAGE}${constants.CHANNEL_ID}/`);
  },
  '@tags': ['UITestChannelDetailPageInAuth'],
  ...commonChannelDetailPageTestCase,
  'Check click a video goes to video detail page': async (browser) => {
    const videos = await browser.element('css selector', '.channels-inside #videoscreen .mobileScreenContainer article:first-of-type a.playChannel');
    const firstItemInListVideo = Object.values(videos.value)[0];
    const href = await browser.elementIdAttribute(firstItemInListVideo, 'href');
    const url = new URL(href.value);
    const type = url.searchParams.get('type');
    browser.elementIdClick(firstItemInListVideo);
    browser.pause(2000);
    if (type === 'live') {
      browser.assert.urlContains('/program-play/');
    } else if (type === 'video') {
      browser.assert.urlContains(`${constants.CHANNEL_ID}/play/`);
    }
  },
};
