const constants = require('../../constants');
const {randomString} = require('../../utils');
const programPreviewTestCase = require('../shared/programPreview');


module.exports = {
  'before': async (browser) => {
    
    constants.CONFIG_APP.ENABLE_HTTP_AUTH && browser.url(constants.PASS_AUTH_BASE_URL);
  },
  'beforeEach': function(browser) {
    const page = browser.page.programpreviewpage();
    page.navigate();
  },
  '@tags': ['UITestProgramPreviewPage'],
  // ...programPreviewTestCase,
  'Check if like, share icon, total views are shown and works': async (browser) => {
    const btnShareClass = '.streaming-player-container .sub-title .sharesBtn';
    browser.assert.visible(btnShareClass, 'Testing if btn share is visible');
    await browser.click(btnShareClass);
    browser.waitForElementVisible(`${btnShareClass} .share-button_dropdown`, 5000, 'Testing if dropdown list share has been visible');
    await browser.click(btnShareClass);
    const btnLikeClass = '.streaming-player-container .sub-title .likeProgram';
    browser.assert.visible(btnLikeClass, 'Testing if btn like is visible');
    await browser.click(btnLikeClass);
    await browser.waitForElementVisible('.swal2-popup.swal2-modal.swal2-show');
    const titleOfModalLogin = await browser.getText('.swal2-popup.swal2-modal.swal2-show .swal2-title');
    browser.assert.equal(titleOfModalLogin.value, 'Please log in to continue', 'Check if like are shown and works');
  
  },
  'Check live chat function: send text by Enter': async (browser) => {
    browser.waitForElementVisible('.live-chat');
    const page = browser.page.programpreviewpage();
    browser.pause(5000); // Wait to load all messages
    page.clickElement('@msgArea');
    const testComment = `test comment: ${randomString()}`;
    page.setInput('@msgArea', testComment);
    browser.pause(2000);
    await browser.keys('\uE007');
    await browser.waitForElementVisible('.swal2-popup.swal2-modal.swal2-show');
    const titleOfModalLogin = await browser.getText('.swal2-popup.swal2-modal.swal2-show .swal2-title');
    browser.assert.equal(titleOfModalLogin.value, 'Please log in to continue', 'Testing if live chat function: send text by Enter when no login');
  },
  'Check live chat function: send emoji by Enter': async (browser) => {
    browser.waitForElementVisible('.live-chat');
    const page = browser.page.programpreviewpage();
    browser.pause(5000);
    page.clickElement('@emojiBtn');
    browser.waitForElementVisible('.fg-emoji-picker', 5000, 'Testing if list emoji has shown');
    const emojiCode = 'U+1F600';

    await browser.click('css selector', `.fg-emoji-picker .fg-emoji-picker-item[data-code="${emojiCode}"]`);
    page.clickElement('@msgArea');
    browser.pause(2000);
    await browser.keys('\uE007');
    await browser.waitForElementVisible('.swal2-popup.swal2-modal.swal2-show');
    const titleOfModalLogin = await browser.getText('.swal2-popup.swal2-modal.swal2-show .swal2-title');
    browser.assert.equal(titleOfModalLogin.value, 'Please log in to continue', 'Testing if live chat function: send emoji by Enter when no login');
  },
  'Check live chat function: send text by click send': async (browser) => {
    browser.waitForElementVisible('.live-chat');
    const page = browser.page.programpreviewpage();
    browser.pause(5000); // Wait to load all messages
    page.clickElement('@msgArea');
    const testComment = `test comment: ${randomString()}`;
    page.setInput('@msgArea', testComment);
    browser.pause(2000);
    page.clickElement('@sendBtn');
    await browser.waitForElementVisible('.swal2-popup.swal2-modal.swal2-show');
    const titleOfModalLogin = await browser.getText('.swal2-popup.swal2-modal.swal2-show .swal2-title');
    browser.assert.equal(titleOfModalLogin.value, 'Please log in to continue', 'Check live chat function: send text by click send');
  },
  'Check live chat function: send emoji by click send': async (browser) => {
    browser.waitForElementVisible('.live-chat');
    const page = browser.page.programpreviewpage();
    browser.pause(5000);
    page.clickElement('@emojiBtn');
    browser.waitForElementVisible('.fg-emoji-picker', 5000, 'Testing if list emoji has shown');
    const emojiCode = 'U+1F600';

    await browser.click('css selector', `.fg-emoji-picker .fg-emoji-picker-item[data-code="${emojiCode}"]`);
    page.clickElement('@msgArea');
    browser.pause(2000);
    page.clickElement('@sendBtn');
    browser.pause(3000); // Wait to load messages

    await browser.waitForElementVisible('.swal2-popup.swal2-modal.swal2-show');
    const titleOfModalLogin = await browser.getText('.swal2-popup.swal2-modal.swal2-show .swal2-title');
    browser.assert.equal(titleOfModalLogin.value, 'Please log in to continue', 'Check live chat function: send emoji by click send');
  },
  'Check if login requred after preview program plays': async (browser) => {
    browser.pause(10000); // Wait video loaded
    await browser.execute(function() {
      const video = document.querySelector('.jw-video.jw-reset');
      const duration = video.duration;
      video.currentTime = duration - 1;
    });
    browser.pause(3000);
    browser.waitForElementVisible('.streaming-player-container .app-link', 5000, 'Testing if modal watch continue display');
    await browser.click('.streaming-player-container .app-link .watchProgramContinue ');
    await browser.waitForElementVisible('.swal2-popup.swal2-modal.swal2-show');
    const titleOfModalLogin = await browser.getText('.swal2-popup.swal2-modal.swal2-show .swal2-title');
    browser.assert.equal(titleOfModalLogin.value, 'Please log in to continue', 'Testing if login modal display');
    await browser.click('.swal2-popup.swal2-modal.swal2-show .swal2-close');
    await browser.click('.streaming-player-container .app-link .playerLink .vr-headset__link:first-of-type');
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

    await browser.click('.streaming-player-container .app-link .playerLink .vr-headset__link:nth-of-type(2)');
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
    
    await browser.click('.streaming-player-container .app-link .playerLink .vr-headset__link:nth-of-type(3)');
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

    await browser.click('.streaming-player-container .app-link  .player-btn-back');
    browser.pause(5000);
    browser.assert.urlEquals(`${constants.LIVEDETAIL_PAGE}${constants.PROGRAM_ID}/`);
  }
};
