const constants = require('../../constants');

module.exports = {
  'Check if it has title, description, video cover image': async (browser) => {
    browser.waitForElementVisible('.videoInfo');
    browser.assert.not.cssProperty('.videoInfo #heroImageList img', 'display', 'none');
    browser.assert.not.attributeEquals('.videoInfo #heroImageList img', 'src', '');
    const title = await browser.getText('.videoInfo .hero-info__viseble .hero-info__content .heroArtist');
    browser.assert.ok(!!title.value, 'Testing if the title is not empty');
    const subTitle = await browser.getText('.videoInfo .hero-info__viseble .hero-info__content .heroTitle');
    browser.assert.ok(!!subTitle.value, 'Testing if the subtitle is not empty');
  },
  'Check if it has like, share, time duration with icon': async (browser) => {
    browser.waitForElementVisible('.videoInfo');
    browser.assert.not.cssProperty('.videoInfo .hero-info__viseble .hero-info__content .heroVideoLike .icon-stats:not(.hidden)', 'display', 'none');
    browser.assert.not.cssProperty('.videoInfo .hero-info__viseble .hero-info__content .stats__item.stats__item--opacity .icon-stats', 'display', 'none');
    const duration = await browser.getText('.videoInfo .hero-info__viseble .hero-info__content .stats__item.stats__item--opacity .heroTime');
    browser.assert.ok(!!duration.value, 'Testing if the duration is not empty');
    browser.assert.not.cssProperty('.videoInfo .hero-info__viseble .hero-info__content .share-button_button .btn-social__share-icon', 'display', 'none');
  },
  'Check back buton': async (browser) => {
    const page = browser.page.videodetailpage();
    page.clickElement('@backBtn');
    browser.assert.urlEquals(constants.BASE_URL);
  },
}
;
