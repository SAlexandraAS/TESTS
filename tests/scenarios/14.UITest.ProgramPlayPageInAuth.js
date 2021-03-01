const constants = require('../../constants');
const {randomString, emojiUnicode, secondsToHms} = require('../../utils');

module.exports = {
  'before': function(browser) {
    
    constants.CONFIG_APP.ENABLE_HTTP_AUTH && browser.url(constants.PASS_AUTH_BASE_URL);
    const loginpage = browser.page.loginpage();
    loginpage.navigate();
    loginpage.setInput('@usenameInput', constants.CORRECT_ACC.username);
    loginpage.setInput('@passwordInput', constants.CORRECT_ACC.password);
    loginpage.submitFormLogin();
  },
  'beforeEach': function(browser) {
    const page = browser.page.programplaypage();
    page.navigate();
  },
  '@tags': ['UITestProgramPlayPageInAuth'],
  'Check if video starts automatically with audio': async (browser) => {
    const videoIsAutoPlay = await browser.execute(function() {
      const video = document.querySelector('.jw-video.jw-reset');
      return !video.paused && !video.ended && video.volume > 0;
    });

    browser.assert.ok(videoIsAutoPlay.value, 'Testing if video starts automatically with audio');
  },
  'Check Play/Pause': async (browser) => {
    browser.pause(8000); // Wait video loaded
    await browser.moveToElement('.livestreaming', 10, 10);
    browser.waitForElementVisible('.programControls');
    browser.click('.programControls .player-btn-play');
    const videoIsPaused = await browser.execute(function() {
      const video = document.querySelector('.jw-video.jw-reset');

      return video.paused;
    });
    browser.pause(5000);
    browser.assert.ok(videoIsPaused.value, 'Testing if video is paused after click button play');

    await browser.moveToElement('.livestreaming', 10, 10);
    browser.waitForElementVisible('.programControls');
    browser.click('.programControls .player-btn-play');

    const videoIsPlayed = await browser.execute(function() {
      const video = document.querySelector('.jw-video.jw-reset');

      return !video.paused && !video.ended;
    });

    browser.assert.ok(videoIsPlayed.value, 'Testing if video is played after click button play');
  },
  '30sec Forward/backward': async (browser) => {
    browser.pause(8000); // Wait video loaded
    const videoCurrentTime = await browser.execute(function() {
      const video = document.querySelector('.jw-video.jw-reset');
      return video.currentTime;
    });
    await browser.moveToElement('.livestreaming', 10, 10);
    browser.waitForElementVisible('.programControls');
    browser.click('.programControls #player-btn-rewind-ahead');
    const videoCurrentTimeAfter = await browser.execute(function() {
      const video = document.querySelector('.jw-video.jw-reset');
      return video.currentTime;
    });

    browser.assert.ok(videoCurrentTimeAfter.value >= videoCurrentTime.value, 'Testing if video is forwarded after click button rewindAhead');

    const videoCurrentTime2 = await browser.execute(function() {
      const video = document.querySelector('.jw-video.jw-reset');
      return video.currentTime;
    });
    await browser.moveToElement('.livestreaming', 10, 10);
    browser.waitForElementVisible('.programControls');
    browser.click('.programControls #player-btn-rewind');
    const videoCurrentTimeAfter2 = await browser.execute(function() {
      const video = document.querySelector('.jw-video.jw-reset');
      return video.currentTime;
    });

    browser.assert.ok(videoCurrentTime2.value >= videoCurrentTimeAfter2.value, 'Testing if video is backwarded after click button rewind');
  },
  'Test toggle full screen': async (browser) => {
    browser.pause(5000); // Wait video loaded
    await browser.moveToElement('.livestreaming', 10, 10);
    browser.waitForElementVisible('.programControls');
    browser.click('.programControls #full-screen-program');
    browser.pause(3000);
    const videoIsInFullScreenMode = await browser.execute(function() {
      return window.innerHeight == screen.height;
    });
    browser.assert.ok(videoIsInFullScreenMode.value,
        'Testing if the video is in fullscreen mode');
  },
  'toggle PIP mode': async (browser) => {
    browser.pause(8000); // Wait video loaded
    await browser.moveToElement('.livestreaming', 10, 10);
    browser.click('.programControls #picture-in-picture');
    browser.pause(5000); 
    const videoIsInPiPMode = await browser.execute(function() {
      return !!document.pictureInPictureEnabled;
    });
    browser.assert.ok(videoIsInPiPMode.value, 'Testing if the video is in PiP mode');
    await browser.moveToElement('.livestreaming', 10, 10);
    browser.click('.programControls #picture-in-picture');
    const videoIsNotInPiPMode = await browser.execute(function() {
      return !!document.pictureInPictureElement;
    });
    browser.assert.ok(!videoIsNotInPiPMode.value, 'Testing if the video is not in PiP mode');
  },
  'Check if it shows correct time info (total video length)': async (browser) => {
    browser.pause(5000); // Wait video loaded
    const videoDuration = await browser.execute(function() {
      const video = document.querySelector('.jw-video.jw-reset');
      return video.duration;
    });

    const videoDurationDisplay = secondsToHms(videoDuration.value);

    const totalTimeVideoEl = await browser.element('css selector', '.programControls .total-time');
    const totalVideo = await browser.elementIdAttribute(Object.values(totalTimeVideoEl.value)[0], 'innerHTML');

    browser.assert.ok(videoDurationDisplay === totalVideo.value, 'Total video length is correct');
  },
  'Check if program name, description, artist image are shown': async (browser) => {
    browser.waitForElementVisible('.program-liveDetailsDesktop');
    browser.assert.visible('.program-liveDetailsDesktop .program_play-liveTitle', 'Testing if title is visible');
    const title = await browser.getText('.program-liveDetailsDesktop .program_play-liveTitle');
    browser.assert.ok(title.value.length, 'Testing if video title is not empty');

    browser.assert.visible('.program-liveDetailsDesktop img.artist__avatar', 'Testing if image is visible');
    const imgSrc = await browser.getAttribute('.program-liveDetailsDesktop img.artist__avatar', 'src');
    browser.assert.ok(imgSrc.value.length, 'Testing if source of artist image is not empty');
  },
  'Check if like, share icon, total views are shown and works': async (browser) => {
    browser.pause(8000); // Wait video loaded
    browser.assert.visible('.livestreaming .sub-title .totalViews', 'Testing if total view is visible');
    const totalView = await browser.getText('.livestreaming .sub-title .totalViews');
    browser.assert.ok(totalView.value.length, 'Testing if total view is not empty');

    const btnLikeClass = '.livestreaming .likes .likeProgram';
    browser.assert.visible(btnLikeClass, 'Testing if btn like is visible');
    const displayPropertyNotLikeBtn = await browser.getCssProperty(`${btnLikeClass} svg.not-liked`, 'display');
    await browser.click(btnLikeClass);
    browser.pause(2000);
    const displayPropertyNotLikeBtnAFterClick = await browser.getCssProperty(`${btnLikeClass} svg.not-liked`, 'display');
    browser.assert.ok(displayPropertyNotLikeBtn.value !== displayPropertyNotLikeBtnAFterClick.value, 'Testing if status of btn like has changed');

    const btnShareClass = '.livestreaming .program-liveShare .sharesBtn';
    browser.assert.visible(btnShareClass, 'Testing if btn share is visible');
    await browser.click(btnShareClass);
    browser.waitForElementVisible(`${btnShareClass} .share-button_dropdown`, 5000, 'Testing if dropdown list share has been visible');
  },
  'Check if emoji icons are shown and works': async (browser) => {
    browser.waitForElementVisible('.emoji--part');
    browser.assert.visible('.emoji .emoji__hand', 'Testing if button emoji like is visible');
    await browser.click('.emoji.emoji--like');
    await browser.waitForElementVisible('.emoji-area .particle.like', 2000, 'Testing if button emoji like works');

    browser.assert.visible('.emoji .emoji__love', 'Testing if button love is visible');
    await browser.click('.emoji.emoji--love');
    await browser.waitForElementVisible('.emoji-area .particle.love', 2000, 'Testing if button emoji love works');

    browser.assert.visible('.emoji .emoji__haha', 'Testing if button haha is visible');
    await browser.click('.emoji.emoji--haha');
    await browser.waitForElementVisible('.emoji-area .particle.haha', 2000, 'Testing if button emoji haha works');

    browser.assert.visible('.emoji .emoji__wow', 'Testing if button wow is visible');
    await browser.click('.emoji.emoji--wow');
    await browser.waitForElementVisible('.emoji-area .particle.wow', 2000, 'Testing if button emoji wow works');

    browser.assert.visible('.emoji .emoji__sad', 'Testing if button sad is visible');
    await browser.click('.emoji.emoji--sad');
    await browser.waitForElementVisible('.emoji-area .particle.sad', 2000, 'Testing if button emoji sad works');

    browser.assert.visible('.emoji .emoji__angry', 'Testing if button angry is visible');
    await browser.click('.emoji.emoji--angry');
    await browser.waitForElementVisible('.emoji-area .particle.angry', 2000, 'Testing if button emoji angry works');
  },
  'Check live chat function: send text by Enter': async (browser) => {
    browser.waitForElementVisible('.live-chat');
    const page = browser.page.programplaypage();
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
    const page = browser.page.programplaypage();
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
    const page = browser.page.programplaypage();
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
    const page = browser.page.programplaypage();
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
  'Check if view more comments are shown when messag box are full of messages': async (browser) => {
    browser.waitForElementVisible('.viewMore .view-more');
    const page = browser.page.programplaypage();
    browser.pause(5000);
    const messageItemBeforeLoadMore = await browser.elements('css selector', '#content .chat_comment');
    const numberOfItemBeforeLoadMore = messageItemBeforeLoadMore.value.length;
    page.clickElement('@viewMoreBtn');
    browser.pause(5000);
    const messageItemAfterLoadMore = await browser.elements('css selector', '#content .chat_comment');
    const numberOfItemAfterLoadMore = messageItemAfterLoadMore.value.length;

    browser.assert.ok(numberOfItemAfterLoadMore >= numberOfItemBeforeLoadMore, 'Testing if the items after loadmore are greater');
  },
}
;
