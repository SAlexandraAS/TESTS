const constants = require('../../constants');

module.exports = {
  'Check if back button': async (browser) => {
    const page = browser.page.artistsdetailpage();
    page.clickElement('@backButton');
    browser.pause(5000);
    browser.assert.urlEquals(constants.ARTIST_PAGE, 'Browser back to artist list');
  },
  'Check if artist background image is shown at the top': async (browser) => {
    browser.assert.not.cssProperty('.singer.singerInfo .singer-inner .singer-image-container', 'display', 'none', 'The artist background image is shown');
    const srcOfBgImg = await browser.getElementProperty('.singer.singerInfo .singer-inner .singer-image-container img', 'src');
    browser.assert.ok(!!srcOfBgImg.value, 'The src of the bachground img is not empty');
  },
  'Check every video has video title': async (browser) => {
    browser.waitForElementVisible('.singer-gallery_section .singer-gallery-content');
    const titlesOfVideoEls = await browser.elements('css selector',
        '.singer-gallery_section .singer-gallery-content #singerData .singer-gallery-item .artist__name');
    let titleNotEmpty = false;
    for (const titleEl of titlesOfVideoEls.value) {
      const titleChannelEl = await browser.elementIdText(Object.values(titleEl)[0]);
      if (titleChannelEl.value) {
        titleNotEmpty = true;
      }
    }
    browser.assert.ok(titleNotEmpty, 'Every video has the title');
  },
  'Check every video has artist image': async (browser) => {
    browser.waitForElementVisible('.singer-gallery_section .singer-gallery-content');
    const imageArtistOfVideoEls = await browser.elements('css selector',
        '.singer-gallery_section .singer-gallery-content #singerData .singer-gallery-item .videogrid__img-wrap img');

    let imgArtist = false;
    for (const artistImage of imageArtistOfVideoEls.value) {
      const artistImageDisplay = await browser.elementIdCssProperty(Object.values(artistImage)[0], 'display');
      const artistImageSrc = await browser.elementIdAttribute(Object.values(artistImage)[0], 'src');
      if (artistImageDisplay.value !== 'none' && !!artistImageSrc.value) {
        imgArtist = true;
      }
    }
    browser.assert.ok(imgArtist, 'Every video has the artist image');
  },
};
