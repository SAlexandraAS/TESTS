module.exports = {
  'Check if video starts automatically with audio': async (browser) => {
    const videoIsAutoPlay = await browser.execute(function() {
      const video = document.querySelector('.jw-video.jw-reset');
      return !video.paused && !video.ended && video.volume > 0;
    });

    browser.assert.ok(videoIsAutoPlay.value, 'Testing if video starts automatically with audio');
  },
  'Check Play/Pause': async (browser) => {
    browser.pause(5000); // Wait video loaded
    await browser.moveToElement('.streaming-player-wrapper', 10, 10);
    browser.waitForElementVisible('.programControls');
    browser.click('.programControls .player-btn-play');
    const videoIsPaused = await browser.execute(function() {
      const video = document.querySelector('.jw-video.jw-reset');

      return video.paused;
    });
    browser.pause(5000);
    browser.assert.ok(videoIsPaused.value, 'Testing if video is paused after click button play');

    await browser.moveToElement('.streaming-player-wrapper', 10, 10);
    browser.waitForElementVisible('.programControls');
    browser.click('.programControls .player-btn-play');

    const videoIsPlayed = await browser.execute(function() {
      const video = document.querySelector('.jw-video.jw-reset');

      return !video.paused && !video.ended;
    });

    browser.assert.ok(videoIsPlayed.value, 'Testing if video is played after click button play');
  },
  'Test toggle full screen': async (browser) => {
    browser.pause(5000); // Wait video loaded
    await browser.moveToElement('.streaming-player-wrapper', 10, 10);
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
    browser.pause(5000); // Wait video loaded
    await browser.moveToElement('.streaming-player-wrapper', 10, 10);
    browser.waitForElementVisible('.programControls');
    browser.click('.programControls #picture-in-picture');
    browser.pause(5000); 
    const videoIsInPiPMode = await browser.execute(function() {
      return !!document.pictureInPictureEnabled;
    });
    browser.pause(8000); 
    browser.assert.ok(videoIsInPiPMode.value, 'Testing if the video is in PiP mode');
  },
  'Check if program name, description, artist image are shown': async (browser) => {
    browser.waitForElementVisible('.preview-liveDetailsDesktop');
    browser.assert.visible('.preview-liveDetailsDesktop .program_play-liveTitle', 'Testing if title is visible');
    const title = await browser.getText('.preview-liveDetailsDesktop .program_play-liveTitle');
    browser.assert.ok(title.value, 'Testing if video title is not empty');

    browser.assert.visible('.preview-liveDetailsDesktop img.artist__avatar', 'Testing if image is visible');
    const imgSrc = await browser.getAttribute('.preview-liveDetailsDesktop img.artist__avatar', 'src');
    browser.assert.ok(imgSrc.value.length, 'Testing if source of artist image is not empty');
  },
  
  'Check if view more comments are shown when message box are full of messages': async (browser) => {
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