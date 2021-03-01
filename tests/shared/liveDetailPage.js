const constants = require('../../constants');

module.exports = {
  'Check if program poster image is shown': async (browser) => {
    browser.assert.visible('#heroImageList img');
    const srcOfImg = await browser.getElementProperty('#heroImageList img', 'src');
    browser.assert.ok(srcOfImg.value.length, 'Testing if src of image is not empty');
  },
  'Check if program title is shown': async (browser) => {
    browser.assert.visible('.hero-info .heroArtistUrl .heroArtist');
    const heroArtistName = await browser.getText('.hero-info .heroArtistUrl .heroArtist');
    browser.assert.ok(heroArtistName.value.length, 'Testing if title is not empty');
  },
  'Check if program description is shown': async (browser) => {
    browser.assert.visible('.hero-info .heroTitle');
    const heroArtistDes = await browser.getText('.hero-info .heroTitle');
    browser.assert.ok(heroArtistDes.value.length, 'Testing if description is not empty');
  },
  'Check if share shown and works': async (browser) => {
    browser.assert.visible('.hero-info__stats .sharesBtn');
    await browser.click('.hero-info__stats .sharesBtn');
    browser.assert.visible('.hero-info__stats .sharesBtn .share-button_dropdown');
    await browser.click('.hero-info__stats .sharesBtn');
    browser.assert.not.visible('.hero-info__stats .sharesBtn .share-button_dropdown');
  },
  'Check preview': async (browser) => {
    browser.waitForElementVisible('#btnContainer');
    await browser.click('#btnContainer #programPreviewBtn');
    browser.assert.urlContains(`preview-play/${constants.PROGRAM_ID}`);
    browser.pause(2000);
    const videoIsAutoPlay = await browser.execute(function() {
      const video = document.querySelector('.jw-video.jw-reset');
      return !video.paused && !video.ended;
    });

    browser.assert.ok(videoIsAutoPlay.value, 'Testing if video is auto-play');
  },
};
