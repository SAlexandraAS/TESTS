const constants = require('../../constants');
const commonArtistPageTestCase = require('../shared/artistPage.mobile');

module.exports = {
  'before': function(browser) { 
    constants.CONFIG_APP.ENABLE_HTTP_AUTH && browser.url(constants.PASS_AUTH_BASE_URL);
  },
  'beforeEach': function(browser) {
    const artistPage = browser.page.artistspage();
    artistPage.navigate();
  },
  '@tags': ['UITestArtistPage'],
  ...commonArtistPageTestCase,
  'Check like/unlike works in no auth mode': async (browser) => {
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
    await browser.moveToElement('.singers.mainPage #videoscreen .mobileScreenContainer .showSingerInfo:nth-of-type(2)', 10, 10);
    await browser.click('.singers.mainPage #videoscreen section.videogrid .singers-gallery-item:first-of-type .artistLike');
    await browser.waitForElementVisible('.swal2-popup.swal2-modal.swal2-show');
    const titleOfModalLogin = await browser.getText('.swal2-popup.swal2-modal.swal2-show .swal2-title');
    browser.assert.equal(titleOfModalLogin.value, 'Please log in to continue', 'Testing if love button work when no login');
  },
};
