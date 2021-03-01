const constants = require('../../constants');
const commonArtistPageTestCase = require('../shared/artistPage.mobile');

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
    const artistPage = browser.page.artistspage();
    artistPage.navigate();
  },
  '@tags': ['UITestArtistPageInAuth'],
  ...commonArtistPageTestCase,
  'Check like/unlike works in auth mode': async (browser) => {
    await browser.moveToElement('.singers.mainPage #videoscreen .mobileScreenContainer .showSingerInfo:nth-of-type(2)', 10, 10);
    const likeBtnOfVideoEls = await browser.elements('css selector',
        '.singers.mainPage #videoscreen section.videogrid .singers-gallery-item .artistLike');

    let likeBtnVideoNotEmpty = false;
    for (const likeBtn of likeBtnOfVideoEls.value) {
      const likeBtnDisplay = await browser.elementIdCssProperty(Object.values(likeBtn)[0], 'display');
      if (likeBtnDisplay.value === 'flex') {
        likeBtnVideoNotEmpty = true;
      }
    }
    browser.assert.ok(likeBtnVideoNotEmpty, 'Every video has the like button');

    await browser.waitForElementNotVisible('.preloader.load', 2000);
    const likeBtnVideoInChannelEl = await browser.element('css selector', '.singers.mainPage #videoscreen section.videogrid .singers-gallery-item:first-of-type .artistLike');
    browser.pause(3000);
    const notLikeSvg = await browser.elementIdElement(Object.values(likeBtnVideoInChannelEl.value)[0], 'css selector', 'svg.not-liked');
    const displayPropertyNotLikeBtn = await browser.elementIdCssProperty(Object.values(notLikeSvg.value)[0], 'display');
    const likeBtnStatus = displayPropertyNotLikeBtn.value;
    await browser.elementIdClick(Object.values(likeBtnVideoInChannelEl.value)[0]);
    browser.pause(3000); // Wait api sent
    browser.refresh(); // Check the like status has been keepe
    browser.pause(3000);
    const likeBtnVideoInChannelElAfterRefresh = await browser.element('css selector', '.singers.mainPage #videoscreen section.videogrid .singers-gallery-item:first-of-type .artistLike');
    const notLikeSvgAfterRefresh = await browser.elementIdElement(Object.values(likeBtnVideoInChannelElAfterRefresh.value)[0], 'css selector', 'svg.not-liked');
    const displayPropertyNotLikeBtnAfterRefresh = await browser.elementIdCssProperty(Object.values(notLikeSvgAfterRefresh.value)[0], 'display');
    const likeBtnStatusAfterRefresh = displayPropertyNotLikeBtnAfterRefresh.value;

    browser.assert.ok((likeBtnStatus === 'block' && likeBtnStatusAfterRefresh === 'none') ||
    (likeBtnStatus === 'none' && likeBtnStatusAfterRefresh === 'block'),
    'Like/Unline icon work when user logged-in');
  },
};
