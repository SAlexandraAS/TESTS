const constants = require('../../constants');
const commonArtistDetailPageTestCase = require('../shared/artistDetailPage');

let detailArtistUrl = null;
module.exports = {
  'before': async (browser) => {
    constants.CONFIG_APP.ENABLE_HTTP_AUTH && browser.url(constants.PASS_AUTH_BASE_URL);
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
  '@tags': ['UITestArtistDetailPage'],
  ...commonArtistDetailPageTestCase,
  'Check like/unlike works in no auth mode': async (browser) => {
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
    await browser.click(likeBtn);
    await browser.waitForElementVisible('.swal2-popup.swal2-modal.swal2-show');
    const titleOfModalLogin = await browser.getText('.swal2-popup.swal2-modal.swal2-show .swal2-title');
    browser.assert.equal(titleOfModalLogin.value, 'Please log in to continue', 'Testing if love button work when no login');
  },
};
