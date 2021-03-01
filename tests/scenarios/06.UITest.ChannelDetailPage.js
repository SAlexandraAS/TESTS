const constants = require('../../constants');
const commonChannelDetailPageTestCase = require('../shared/channelDetailPage');

module.exports = {
  'before': async (browser) => {
    
    constants.CONFIG_APP.ENABLE_HTTP_AUTH && browser.url(constants.PASS_AUTH_BASE_URL);
  },
  'beforeEach': function(browser) {
    browser.url(`${constants.CHANNEL_PAGE}${constants.CHANNEL_ID}/`);
  },
  '@tags': ['UITestChannelDetailPage'],
  ...commonChannelDetailPageTestCase,
  'Check click a video goes to video detail page when no login': async (browser) => {
    const video = await browser.element('css selector', '.channels-inside #videoscreen .videogrid article.videogrid__item:first-of-type a.videogrid__img-wrap');
    browser.elementIdClick(Object.values(video.value)[0]);
    browser.pause(2000);
    await browser.waitForElementVisible('.swal2-popup.swal2-modal.swal2-show');
    const titleOfModalLogin = await browser.getText('.swal2-popup.swal2-modal.swal2-show .swal2-title');
    browser.assert.equal(titleOfModalLogin.value, 'Please log in to continue', 'Testing if When no login, modal require login show up');
  },
  'Check like/unlike icon works for normal user': async (browser) => {
    const likeBtnLiveInChannelEls = await browser.element('css selector', '.channels-inside .dataChannel article.videogrid__item:first-of-type .videogrid-info .videogrid__actions .likeProgram');
    const likeBtnVideoInChannelEls = await browser.element('css selector', '.channels-inside .dataChannel article.videogrid__item:first-of-type .videogrid-info .videogrid__actions .likeSlider');
    const likeBtn = likeBtnLiveInChannelEls.status === 0 ? Object.values(likeBtnLiveInChannelEls.value)[0] : Object.values(likeBtnVideoInChannelEls.value)[0];
    await browser.elementIdClick(likeBtn);
    await browser.waitForElementVisible('.swal2-popup.swal2-modal.swal2-show');
    const titleOfModalLogin = await browser.getText('.swal2-popup.swal2-modal.swal2-show .swal2-title');
    browser.assert.equal(titleOfModalLogin.value, 'Please log in to continue', 'When no login, modal require login show up');
  },
};
