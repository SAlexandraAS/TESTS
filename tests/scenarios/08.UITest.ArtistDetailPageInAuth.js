const constants = require('../../constants');
const commonArtistDetailPageTestCase = require('../shared/artistDetailPage');

let detailArtistUrl = null;
module.exports = {
  'before': async (browser) => {
    constants.CONFIG_APP.ENABLE_HTTP_AUTH && browser.url(constants.PASS_AUTH_BASE_URL);
    const loginPage = browser.page.loginpage();
    loginPage.navigate();
    loginPage.setInput('@usenameInput', constants.CORRECT_ACC.username);
    loginPage.setInput('@passwordInput', constants.CORRECT_ACC.password);
    loginPage.submitFormLogin();

    const artistPage = browser.page.artistsdetailpage();
    artistPage.navigate();
    browser.waitForElementVisible('.singers.mainPage .autoSlider-container');
    const firstItemInListArtist = await browser.element('css selector',
        '.singers.mainPage #videoscreen section.videogrid .singers-gallery-item:first-of-type .singers-gallery-link');
    const href = await browser.elementIdAttribute(Object.values(firstItemInListArtist.value)[0], 'href');
    detailArtistUrl = href.value;
  },
  'beforeEach': function(browser) {
    browser.url(detailArtistUrl);
  },
  '@tags': ['UITestArtistDetailPageInAuth'],
  ...commonArtistDetailPageTestCase,
  'Check like/unlike works in auth mode': async (browser) => {
    const likeBtnOfVideoEls = await browser.elements('css selector',
        '.singer-gallery_section .singer-gallery-content #singerData .singer-gallery-item .videogrid__actions div[data-liked]');
    let likeBtnVideoNotEmpty = false;
    for (const likeBtn of likeBtnOfVideoEls.value) {
      const likeBtnDisplay = await browser.elementIdCssProperty(Object.values(likeBtn)[0], 'display');
      if (likeBtnDisplay.value !== 'none') {
        likeBtnVideoNotEmpty = true;
      }
    }
    browser.assert.ok(likeBtnVideoNotEmpty, 'Every video has the like button');

    const likeBtn = '.singer-gallery_section .singer-gallery-content #singerData .singer-gallery-item:first-of-type .videogrid__actions div[data-liked]';
    const likeBtnEl = await browser.element('css selector', likeBtn);
    const notLikeSvg = await browser.elementIdElement(Object.values(likeBtnEl.value)[0], 'css selector', 'svg.not-liked');
    const displayPropertyNotLikeBtn = await browser.elementIdCssProperty(Object.values(notLikeSvg.value)[0], 'display');
    const likeBtnStatus = displayPropertyNotLikeBtn.value;
    await browser.elementIdClick(Object.values(likeBtnEl.value)[0]);
    browser.pause(2000); // Wait api sent
    browser.refresh();
    browser.pause(3000);
    const likeBtnVideoInChannelElsAfterRefresh = await browser.element('css selector', likeBtn);
    const notLikeSvgAfterRefresh = await browser.elementIdElement(Object.values(likeBtnVideoInChannelElsAfterRefresh.value)[0], 'css selector', 'svg.not-liked');
    const displayPropertyNotLikeBtnAfterRefesrh = await browser.elementIdCssProperty(Object.values(notLikeSvgAfterRefresh.value)[0], 'display');
    const likeBtnStatusAfterRefresh = displayPropertyNotLikeBtnAfterRefesrh.value;
    const isTrue = (likeBtnStatus === 'block' && likeBtnStatusAfterRefresh === 'none') || (likeBtnStatus === 'none' && likeBtnStatusAfterRefresh === 'block');
    browser.assert.ok(isTrue, 'Like/Unline icon work when user logged-in');
  },
};
