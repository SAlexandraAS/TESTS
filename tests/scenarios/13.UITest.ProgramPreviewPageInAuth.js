const constants = require('../../constants');
const {randomString, emojiUnicode} = require('../../utils');
const programPreviewTestCase = require('../shared/programPreview');

module.exports = {
  'before': async (browser) => {
    
    constants.CONFIG_APP.ENABLE_HTTP_AUTH && browser.url(constants.PASS_AUTH_BASE_URL);
    const loginpage = browser.page.loginpage();
    loginpage.navigate();
    loginpage.setInput('@usenameInput', constants.CORRECT_ACC.username);
    loginpage.setInput('@passwordInput', constants.CORRECT_ACC.password);
    loginpage.submitFormLogin();
  },
  'beforeEach': function(browser) {
    const page = browser.page.programpreviewpage();
    page.navigate();
  },
  '@tags': ['UITestProgramPreviewPageInAuth'],
  ...programPreviewTestCase,
  'Check if like, share icon, total views are shown and works': async (browser) => {
    const btnLikeClass = '.streaming-player-container .sub-title .likeProgram';
    browser.assert.visible(btnLikeClass, 'Testing if btn like is visible');
    const displayPropertyNotLikeBtn = await browser.getCssProperty(`${btnLikeClass} svg.not-liked`, 'display');
    await browser.click(btnLikeClass);
    browser.pause(2000);
    const displayPropertyNotLikeBtnAFterClick = await browser.getCssProperty(`${btnLikeClass} svg.not-liked`, 'display');
    browser.assert.ok(displayPropertyNotLikeBtn.value !== displayPropertyNotLikeBtnAFterClick.value, 'Testing if status of btn like has changed');

    const btnShareClass = '.streaming-player-container .sub-title .sharesBtn';
    browser.assert.visible(btnShareClass, 'Testing if btn share is visible');
    await browser.click(btnShareClass);
    browser.waitForElementVisible(`${btnShareClass} .share-button_dropdown`, 5000, 'Testing if dropdown list share has been visible');
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
    browser.pause(3000); // Wait to load messages
    const lastestMsgClass = '.live-chat #content .message:last-of-type';
    const lastestItemChat = await browser.element('css selector', lastestMsgClass);
    browser.assert.visible(`${lastestMsgClass} img.live-chat-user_avatar`);
    const avatar = await browser.elementIdElement(Object.values(lastestItemChat.value)[0], 'css selector', 'img.live-chat-user_avatar');
    const avartarSrc = await browser.elementIdAttribute(Object.values(avatar.value)[0], 'src');
    browser.assert.ok(avartarSrc.value.length, 'Testing if avatar is not null');

    browser.assert.visible(`${lastestMsgClass} .upcoming_message .upcoming_time`, 'Testing if the lastest message show time');
    browser.assert.visible(`${lastestMsgClass} .upcoming_message .upcoming_username`, 'Testing if the lastest message show username');
    browser.assert.visible(`${lastestMsgClass} .upcoming_message .msg_content`, 'Testing if the lastest message has content');
    const contentEl = await browser.elementIdElement(Object.values(lastestItemChat.value)[0], 'css selector', '.upcoming_message .msg_content');
    const contentTxt = await browser.elementIdText(Object.values(contentEl.value)[0]);
    browser.assert.ok(testComment === contentTxt.value.trim(), 'Testing if the content of the lastest is correct');
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
    browser.pause(3000); // Wait to load messages

    const lastestMsgClass = '.live-chat #content .message:last-of-type';
    const lastestItemChat = await browser.element('css selector', lastestMsgClass);
    browser.assert.visible(`${lastestMsgClass} img.live-chat-user_avatar`);
    const avatar = await browser.elementIdElement(Object.values(lastestItemChat.value)[0], 'css selector', 'img.live-chat-user_avatar');
    const avartarSrc = await browser.elementIdAttribute(Object.values(avatar.value)[0], 'src');
    browser.assert.ok(avartarSrc.value.length, 'Testing if avatar is not null');

    browser.assert.visible(`${lastestMsgClass} .upcoming_message .upcoming_time`, 'Testing if the lastest message show time');
    browser.assert.visible(`${lastestMsgClass} .upcoming_message .upcoming_username`, 'Testing if the lastest message show username');
    browser.assert.visible(`${lastestMsgClass} .upcoming_message .msg_content`, 'Testing if the lastest message has content');
    const contentEl = await browser.elementIdElement(Object.values(lastestItemChat.value)[0], 'css selector', '.upcoming_message .msg_content');
    const emoji = await browser.elementIdAttribute(Object.values(contentEl.value)[0], 'innerText');
    const emojiToUtf = emojiUnicode(emoji.value.trim());
    browser.assert.ok(emojiCode === emojiToUtf, 'Testing if the content of the lastest is correct');
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
    browser.pause(3000); // Wait to load messages
    const lastestMsgClass = '.live-chat #content .message:last-of-type';
    const lastestItemChat = await browser.element('css selector', lastestMsgClass);
    browser.assert.visible(`${lastestMsgClass} img.live-chat-user_avatar`);
    const avatar = await browser.elementIdElement(Object.values(lastestItemChat.value)[0], 'css selector', 'img.live-chat-user_avatar');
    const avartarSrc = await browser.elementIdAttribute(Object.values(avatar.value)[0], 'src');
    browser.assert.ok(avartarSrc.value.length, 'Testing if avatar is not null');

    browser.assert.visible(`${lastestMsgClass} .upcoming_message .upcoming_time`, 'Testing if the lastest message show time');
    browser.assert.visible(`${lastestMsgClass} .upcoming_message .upcoming_username`, 'Testing if the lastest message show username');
    browser.assert.visible(`${lastestMsgClass} .upcoming_message .msg_content`, 'Testing if the lastest message has content');
    const contentEl = await browser.elementIdElement(Object.values(lastestItemChat.value)[0], 'css selector', '.upcoming_message .msg_content');
    const contentTxt = await browser.elementIdText(Object.values(contentEl.value)[0]);
    browser.assert.ok(testComment === contentTxt.value.trim(), 'Testing if the content of the lastest is correct');
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

    const lastestMsgClass = '.live-chat #content .message:last-of-type';
    const lastestItemChat = await browser.element('css selector', lastestMsgClass);
    browser.assert.visible(`${lastestMsgClass} img.live-chat-user_avatar`);
    const avatar = await browser.elementIdElement(Object.values(lastestItemChat.value)[0], 'css selector', 'img.live-chat-user_avatar');
    const avartarSrc = await browser.elementIdAttribute(Object.values(avatar.value)[0], 'src');
    browser.assert.ok(avartarSrc.value.length, 'Testing if avatar is not null');

    browser.assert.visible(`${lastestMsgClass} .upcoming_message .upcoming_time`, 'Testing if the lastest message show time');
    browser.assert.visible(`${lastestMsgClass} .upcoming_message .upcoming_username`, 'Testing if the lastest message show username');
    browser.assert.visible(`${lastestMsgClass} .upcoming_message .msg_content`, 'Testing if the lastest message has content');
    const contentEl = await browser.elementIdElement(Object.values(lastestItemChat.value)[0], 'css selector', '.upcoming_message .msg_content');
    const emoji = await browser.elementIdAttribute(Object.values(contentEl.value)[0], 'innerText');
    const emojiToUtf = emojiUnicode(emoji.value.trim());
    browser.assert.ok(emojiCode === emojiToUtf, 'Testing if the content of the lastest is correct');
  },
  'Check if login requred after preview video plays': async (browser) => {
    browser.pause(10000); // Wait video loaded
    await browser.execute(function() {
      const video = document.querySelector('.jw-video.jw-reset');
      const duration = video.duration;
      video.currentTime = duration - 1;
    });
    browser.pause(3000);
    browser.waitForElementVisible('.streaming-player-container .app-link', 5000, 'Testing if modal watch continue display');
    
    
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

    await browser.click('.streaming-player-container .app-link .watchProgramContinue');
    browser.assert.urlEquals(`${constants.PROGRAM_PLAY_PAGE}${constants.PROGRAM_ID}/`, 'Testing if go back to video player when click watch continue');
  }
};