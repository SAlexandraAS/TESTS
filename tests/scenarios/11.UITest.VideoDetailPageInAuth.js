const constants = require('../../constants');
const videoDetailPageTestCase = require('../shared/videoDetailPage');
const {secondsToHms} = require('../../utils');

module.exports = {
  'before': async (browser) => {
    constants.CONFIG_APP.ENABLE_HTTP_AUTH && browser.url(constants.PASS_AUTH_BASE_URL);
    const loginPage = browser.page.loginpage();
    loginPage.navigate();
    loginPage.setInput('@usenameInput', constants.CORRECT_ACC.username);
    loginPage.setInput('@passwordInput', constants.CORRECT_ACC.password);
    loginPage.submitFormLogin();
  },
  'beforeEach': function(browser) {
    browser.url(`${constants.VIDEO_PAGE}${constants.PREMIUM_VIDEO_ID}/`);
  },
  '@tags': ['UITestVideoDetailPageInAuth'],
  ...videoDetailPageTestCase,
  'Reload player page and check if it auto starts': async (browser) => {
    const page = browser.page.videodetailpage();
    page.clickElement('@playBtn');
    browser.assert.urlContains('play');
    browser.refresh();
    browser.pause(2000);
    const videoIsAutoPlay = await browser.execute(function() {
      const video = document.querySelector('.jw-video.jw-reset');

      return !video.paused && !video.ended;
    });

    browser.assert.ok(videoIsAutoPlay.value, 'Testing if video is auto-play');
  },
  'Volume check when playing and after reload': async (browser) => {
    const page = browser.page.videodetailpage();
    page.clickElement('@playBtn');
    browser.assert.urlContains('play');
    browser.refresh();
    browser.pause(2000);
    const videoIsAutoPlay = await browser.execute(function() {
      const video = document.querySelector('.jw-video.jw-reset');
      return video.volume > 0;
    });

    browser.assert.ok(videoIsAutoPlay.value, 'Testing if video is not muted');
  },
  'Check if it shows correct time info (total video length)': async (browser) => {
    const page = browser.page.videodetailpage();
    page.clickElement('@playBtn');
    browser.assert.urlContains('play');
    browser.pause(5000); // Wait video loaded
    const videoDuration = await browser.execute(function() {
      const video = document.querySelector('.jw-video.jw-reset');
      return video.duration;
    });

    const videoDurationDisplay = secondsToHms(videoDuration.value);

    const totalTimeVideoEl = await browser.element('css selector', '.video_player-actions .totalTime');
    const totalVideo = await browser.elementIdAttribute(Object.values(totalTimeVideoEl.value)[0], 'innerHTML');

    browser.assert.ok(videoDurationDisplay === totalVideo.value, 'Total video length is correct');
  },
  'Check if all controls are shown': async (browser) => {
    const page = browser.page.videodetailpage();
    page.clickElement('@playBtn');
    browser.assert.urlContains('play');
    browser.pause(5000); // Wait video loaded
    await browser.moveToElement('.video_player', 10, 10);
    browser.waitForElementVisible('.video_player-actions');
    browser.assert.visible('.video_player-actions .video_player-controls-button.previousBtn');
    browser.assert.visible('.video_player-actions .video_player-controls-button.rewind');
    browser.assert.visible('.video_player-actions .video_player-controls-button.playBtn');
    browser.assert.visible('.video_player-actions .video_player-controls-button.rewindAhead');
    browser.assert.visible('.video_player-actions .video_player-controls-button.nextBtn');
    browser.assert.visible('.video_player-actions .video_player-controls-button.volumeBtn');
    browser.assert.visible('.video_player-actions .video_player-controls-button.fullScreenBtn');
    browser.assert.visible('.video_player-actions .video_player-controls-button.pipBtn');
    browser.assert.visible('.video_player-actions .video_player-controls-button.likeContent ');
  },
  'Check Play/Pause, 30sec Forward/backward, Next/Prev, toggle full screen, toggle PIP mode, check like/unlike': async (browser) => {
    const page = browser.page.videodetailpage();
    page.clickElement('@playBtn');
    browser.assert.urlContains('play');
    browser.pause(5000); // Wait video loaded
    await browser.moveToElement('.video_player', 10, 10);
    browser.waitForElementVisible('.video_player-actions');
    browser.click('.video_player-actions .video_player-controls-button.playBtn');
    const videoIsPaused = await browser.execute(function() {
      const video = document.querySelector('.jw-video.jw-reset');

      return video.paused;
    });
    browser.pause(5000);
    browser.assert.ok(videoIsPaused.value, 'Testing if video is paused after click button play');

    await browser.moveToElement('.video_player', 10, 10);
    browser.waitForElementVisible('.video_player-actions');
    browser.click('.video_player-actions .video_player-controls-button.playBtn');

    const videoIsPlayed = await browser.execute(function() {
      const video = document.querySelector('.jw-video.jw-reset');

      return !video.paused && !video.ended;
    });

    browser.assert.ok(videoIsPlayed.value, 'Testing if video is played after click button play');
  },
  '30sec Forward/backward': async (browser) => {
    const page = browser.page.videodetailpage();
    page.clickElement('@playBtn');
    browser.assert.urlContains('play');
    browser.pause(5000); // Wait video loaded
    const videoCurrentTime = await browser.execute(function() {
      const video = document.querySelector('.jw-video.jw-reset');
      return video.currentTime;
    });
    await browser.moveToElement('.video_player', 10, 10);
    browser.waitForElementVisible('.video_player-actions');
    browser.click('.video_player-actions .video_player-controls-button.rewindAhead');
    const videoCurrentTimeAfter = await browser.execute(function() {
      const video = document.querySelector('.jw-video.jw-reset');
      return video.currentTime;
    });

    browser.assert.ok(videoCurrentTimeAfter.value >= videoCurrentTime.value, 'Testing if video is forwarded after click button rewindAhead');

    const videoCurrentTime2 = await browser.execute(function() {
      const video = document.querySelector('.jw-video.jw-reset');
      return video.currentTime;
    });
    await browser.moveToElement('.video_player', 10, 10);
    browser.waitForElementVisible('.video_player-actions');
    browser.click('.video_player-actions .video_player-controls-button.rewind');
    const videoCurrentTimeAfter2 = await browser.execute(function() {
      const video = document.querySelector('.jw-video.jw-reset');
      return video.currentTime;
    });

    browser.assert.ok(videoCurrentTime2.value >= videoCurrentTimeAfter2.value, 'Testing if video is backwarded after click button rewind');
  },
  'Test Next/Prev': async (browser) => {
    const page = browser.page.videodetailpage();
    page.clickElement('@playBtn');
    browser.assert.urlContains('play');
    const currentUrl = await browser.url();
    browser.pause(5000); // Wait video loaded
    await browser.moveToElement('.video_player', 10, 10);
    browser.waitForElementVisible('.video_player-actions');
    browser.click('.video_player-actions .video_player-controls-button.nextBtn');
    browser.pause(5000);
    const currentUrlAfterClickBtnNext = await browser.url();
    browser.assert.ok(currentUrlAfterClickBtnNext.value !== currentUrl.value,
        'Testing if the another video has been played after click button next');
    await browser.moveToElement('.video_player', 10, 10);
    browser.waitForElementVisible('.video_player-actions');
    browser.click('.video_player-actions .video_player-controls-button.previousBtn');
    browser.pause(5000);
    const currentUrlAfterClickBack = await browser.url();
    browser.assert.ok(currentUrlAfterClickBack.value !== currentUrlAfterClickBtnNext.value,
        'Testing if the another video has been played after click button back');
  },
  'Test toggle full screen': async (browser) => {
    const page = browser.page.videodetailpage();
    page.clickElement('@playBtn');
    browser.assert.urlContains('play');
    browser.pause(5000); // Wait video loaded
    await browser.moveToElement('.video_player', 10, 10);
    browser.waitForElementVisible('.video_player-actions');
    browser.click('.video_player-actions .video_player-controls-button.fullScreenBtn');
    browser.pause(3000);
    const videoIsInFullScreenMode = await browser.execute(function() {
      return window.innerHeight == screen.height;
    });
    browser.assert.ok(videoIsInFullScreenMode.value,
        'Testing if the video is in fullscreen mode');
  },
  'toggle PIP mode': async (browser) => {
    const page = browser.page.videodetailpage();
    page.clickElement('@playBtn');
    browser.assert.urlContains('play');
    browser.pause(5000); // Wait video loaded
    await browser.moveToElement('.video_player', 10, 10);
    browser.click('.video_player-actions .video_player-controls-button.pipBtn');
    browser.pause(5000);
    const videoIsInPiPMode = await browser.execute(function() {
      return !!document.pictureInPictureEnabled;
    });
    browser.pause(8000); 
    browser.assert.ok(videoIsInPiPMode.value, 'Testing if the video is in PiP mode');
    await browser.moveToElement('.video_player', 10, 10);
    browser.click('.video_player-actions .video_player-controls-button.pipBtn');
    const videoIsNotInPiPMode = await browser.execute(function() {
      return !!document.pictureInPictureElement;
    });
    browser.assert.ok(!videoIsNotInPiPMode.value, 'Testing if the video is not in PiP mode');
  },
  'check like/unlike': async (browser) => {
    const page = browser.page.videodetailpage();
    page.clickElement('@playBtn');
    browser.assert.urlContains('play');
    browser.pause(5000); // Wait video loaded
    const btnLike = '.video_player-actions .video_player-controls-button.likeContent';
    const getClassNameOfBtn = await browser.getElementProperty(btnLike, 'classList');
    const videoHasbeenLiked = getClassNameOfBtn.value.includes('liked');
    await browser.moveToElement('.video_player', 10, 10);
    browser.click('.video_player-actions .video_player-controls-button.likeContent');
    browser.pause(2000);
    const getClassNameOfBtn2 = await browser.getElementProperty(btnLike, 'classList');
    const videoHasbeenLiked2 = getClassNameOfBtn2.value.includes('liked');
    browser.assert.ok(videoHasbeenLiked !== videoHasbeenLiked2, 'Testing if button like has been work');
  },
  'Check if it shows video title and description, artist logo at the top when mouse over': async (browser) => {
    const page = browser.page.videodetailpage();
    page.clickElement('@playBtn');
    browser.assert.urlContains('play');
    browser.pause(5000); // Wait video loaded
    await browser.moveToElement('.video_player', 10, 10);
    browser.assert.visible('.meta_author.video_player-meta_author');
    // meta_author
    const srcArtistLogo = await browser.getAttribute('.meta_author img.meta_author-image', 'src');
    browser.assert.ok(!!srcArtistLogo.value, 'Testing if avatar of artsit is not empty');
    const artistname = await browser.getText('.meta_author-info a.meta_author-name-link');
    const artistDes = await browser.getText('.meta_author-info a.meta_author-title-link');
    browser.assert.ok(!!artistname.value && !!artistDes.value, 'Testing if information of artsit is not empty');
  },
  'Check recommended videos when mouse over': async (browser) => {
    const page = browser.page.videodetailpage();
    page.clickElement('@playBtn');
    browser.assert.urlContains('play');
    browser.pause(5000); // Wait video loaded
    await browser.moveToElement('.video_player', 10, 10);
    browser.waitForElementVisible('.video_player-actions');
    const recommendedVideos = await browser.elements('css selector', '.home_slider-content ul.home_slider-list li.playerListItemMain ');
    let eachVideoHasTitle = false;
    let eachVideoHasDes = false;
    let eachVideoHasImage = false;
    for (const video of recommendedVideos.value) {
      const videoImage = await browser.elementIdElement(Object.values(video)[0], 'css selector', '.home_slider-image');
      const videoImgSrc = await browser.elementIdAttribute(Object.values(videoImage.value)[0], 'src');
      if (videoImgSrc.value) {
        eachVideoHasImage = true;
      }

      const videoDes = await browser.elementIdElement(Object.values(video)[0], 'css selector', '.home_slider-info .home_slider-details a.home_slider-title-link');
      const videoDesTxt = await browser.elementIdText(Object.values(videoDes.value)[0]);
      if (videoDesTxt.value) {
        eachVideoHasDes = true;
      }

      const videoTitle = await browser.elementIdElement(Object.values(video)[0], 'css selector', '.home_slider-info .home_slider-details a.home_slider-name-link');
      const videoTitleTxt = await browser.elementIdText(Object.values(videoTitle.value)[0]);
      if (videoTitleTxt.value) {
        eachVideoHasTitle = true;
      }
    }
    browser.assert.ok(eachVideoHasDes && eachVideoHasImage && eachVideoHasTitle, 'Testing if all recomended video has title and description');
  },
  'Check if video moves next video automatically when it finishes play a video': async (browser) => {
    const page = browser.page.videodetailpage();
    page.clickElement('@playBtn');
    browser.assert.urlContains('play');
    browser.pause(5000); // Wait video loaded
    const currentUrl = await browser.url();
    await browser.execute(function() {
      const video = document.querySelector('.jw-video.jw-reset');
      const duration = video.duration;
      video.currentTime = duration - 1;
    });
    browser.pause(12000);
    const currentUrlAfterFinish = await browser.url();
    console.log('=====>', currentUrl.value, currentUrlAfterFinish.value);
    browser.assert.ok(currentUrl.value !== currentUrlAfterFinish.value, 'The next video has been play after the current video ended');
  },
};
