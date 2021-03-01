const constants = require('../../constants');
const videoPreviewPageTestCase = require('../shared/videoPreview');
const {secondsToHms} = require('../../utils');

module.exports = {
  'before': async (browser) => {
    
    constants.CONFIG_APP.ENABLE_HTTP_AUTH && browser.url(constants.PASS_AUTH_BASE_URL);
  },
  'beforeEach': function(browser) {
    browser.url(`${constants.VIDEO_PAGE}${constants.PREMIUM_VIDEO_ID}`);
  },
  '@tags': ['UITestVideoPreviewPage'],
  ...videoPreviewPageTestCase,
  'check like/unlike': async (browser) => {
    const page = browser.page.videodetailpage();
    page.clickElement('@playPreviewBtn');
    browser.assert.urlContains('preview');
    browser.pause(5000); // Wait video loaded
    await browser.moveToElement('.video_player', 10, 10);
    browser.click('.video_player-actions .video_player-controls-button.likeContent');
    browser.pause(2000);
    await browser.waitForElementVisible('.swal2-popup.swal2-modal.swal2-show');
    const titleOfModalLogin = await browser.getText('.swal2-popup.swal2-modal.swal2-show .swal2-title');
    browser.assert.equal(titleOfModalLogin.value, 'Please log in to continue', 'Testing if love button work when no login');
  },
  'Check if login requred after preview video plays': async (browser) => {
    const page = browser.page.videodetailpage();
    page.clickElement('@playPreviewBtn');
    browser.assert.urlContains('preview');
    browser.pause(10000); // Wait video loaded
    await browser.execute(function() {
      const video = document.querySelector('.jw-video.jw-reset');
      const duration = video.duration;
      video.currentTime = duration - 1;
    });
    browser.pause(3000);
    browser.waitForElementVisible('.video_player-inner .videoPlayer .app-link', 5000, 'Testing if modal watch continue display');
    await browser.click('.video_player-inner .videoPlayer .app-link .watchContinue');
    await browser.waitForElementVisible('.swal2-popup.swal2-modal.swal2-show');
    const titleOfModalLogin = await browser.getText('.swal2-popup.swal2-modal.swal2-show .swal2-title');
    browser.assert.equal(titleOfModalLogin.value, 'Please log in to continue', 'Testing if login modal display');
    await browser.click('.swal2-popup.swal2-modal.swal2-show .swal2-close');
    await browser.click('.video_player-inner .videoPlayer .app-link .playerLink .vr-headset__link:first-of-type');
    browser.pause(5000);
    browser.windowHandles(function(result) {
      const handle = result.value[1];
      browser.switchWindow(handle);
      browser.assert.urlContains('vr-headset', 'Testing if "GET THE CEEK VR HEADSET" goes to https://www.ceekvr.com/vr-headset');
    });
    browser.closeWindow();

    browser.windowHandles(function(result) {
      const handle = result.value[0];
      browser.switchWindow(handle);
    });

    await browser.click('.video_player-inner .videoPlayer .app-link .playerLink .vr-headset__link:nth-of-type(2)');
    browser.windowHandles(function(result) {
      const handle = result.value[1];
      browser.switchWindow(handle);
      browser.assert.urlContains('play.google.com', 'Testing if android app link works');
    });
    browser.closeWindow();

    browser.windowHandles(function(result) {
      const handle = result.value[0];
      browser.switchWindow(handle);
    });
    
    await browser.click('.video_player-inner .videoPlayer .app-link .playerLink .vr-headset__link:nth-of-type(3)');
    browser.windowHandles(function(result) {
      const handle = result.value[1];
      browser.switchWindow(handle);
      browser.assert.urlContains('apps.apple.com', 'Testing if ios app link works');
    });
    browser.closeWindow();

    browser.windowHandles(function(result) {
      const handle = result.value[0];
      browser.switchWindow(handle);
    });

    await browser.click('.video_player-inner .videoPlayer .player-btn-back');
    browser.pause(5000);
    browser.assert.urlEquals(`${constants.VIDEO_PAGE}${constants.PREMIUM_VIDEO_ID}/`);
  }
};