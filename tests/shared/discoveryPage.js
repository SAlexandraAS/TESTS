module.exports = {
  'Check if top slider shows video name, description, artist image': async (browser) => {
    await browser.waitForElementVisible('.autoSlider-container');
    const topSliderItems = await browser.elements('css selector', '.autoSlider-container .topSliderItem');
    let eachItemHasImage = false;
    let eachItemHasTitle = false;
    let eachItemHasDes = false;
    let atLeastAttemHasShow = false;
    for (const item of topSliderItems.value) {
      const img = await browser.elementIdElement(Object.values(item)[0], 'css selector', '.slide-image img');
      const imgSrc = await browser.elementIdAttribute(Object.values(img.value)[0], 'src');
      if (imgSrc.value.length) {
        eachItemHasImage = true;
      }

      const videoName = await browser.elementIdElement(Object.values(item)[0], 'css selector', '.video-subtitle-slider .video-title');
      const title = await browser.elementIdAttribute(Object.values(videoName.value)[0], 'innerHTML');
      if (title.value.length) {
        eachItemHasTitle = true;
      }

      const videoDes = await browser.elementIdElement(Object.values(item)[0], 'css selector', '.video-subtitle-slider .video-header .singerName');
      const description = await browser.elementIdAttribute(Object.values(videoDes.value)[0], 'innerHTML');
      if (description.value.length) {
        eachItemHasDes = true;
      }

      const displayPropertyOfItem = await browser.elementIdCssProperty(Object.values(item)[0], 'display');
      if (displayPropertyOfItem.value == 'block') {
        atLeastAttemHasShow = true;
      }
    }
    browser.assert.ok(eachItemHasImage && eachItemHasTitle && eachItemHasDes && atLeastAttemHasShow, 'Testing if at least item has been displayed');
  },
  'Check table/list view mode': async (browser) => {
    const page = browser.page.discoverypage();
    const changeTypeListBtn = await browser.getAttribute('.discover__wrap a.changeTypeList', 'data-type');
    browser.assert.ok(changeTypeListBtn.value === 'list', 'The button switch to "list" mode should be enable at init');
    browser.assert.domPropertyContains('#videoscreen > section', 'className', 'videogrid', 'The grid mode should be visible at init');
    page.clickElement('@changeTypeListBtn');
    browser.pause(5000);
    const changeTypeListBtn2 = await browser.getAttribute('.discover__wrap a.changeTypeList', 'data-type');


    browser.assert.ok(changeTypeListBtn2.value === 'table', 'The button switch to "grid" mode should be enable after switch to list');
    browser.assert.domPropertyContains('#videoscreen > section', 'className', 'videolist', 'The list mode should be visible after switch to list');
    browser.refresh();
    browser.assert.ok(changeTypeListBtn2.value === 'table', 'The button switch to "grid" mode should still be enable after refresh');
    browser.assert.domPropertyContains('#videoscreen > section', 'className', 'videolist', 'The list mode should be visible after refresh');
  },
  'Check if each video has title, description, share/like icon in LIST mode': async (browser) => {
    browser.pause(2000);
    await browser.waitForElementVisible('#videoscreen section.videolist', 2000, 'Channel list is shown');

    const titleChannelEls = await browser.elements('css selector', '#videoscreen section.videolist .videolist__item .videolist__col--title .videoTitle');
    let titleNotEmpty = false;
    for (const titleEl of titleChannelEls.value) {
      const titleChannelEl = await browser.elementIdText(Object.values(titleEl)[0]);
      if (titleChannelEl.value) {
        titleNotEmpty = true;
      }
    }
    browser.assert.ok(titleNotEmpty, 'Every video has description');

    const desChannelEls = await browser.elements('css selector', '#videoscreen section.videolist .videolist__item .video-artist .artist .artist__name');
    let desNotEmpty = false;
    for (const desEl of desChannelEls.value) {
      const desChannelTxt = await browser.elementIdText(Object.values(desEl)[0]);
      if (desChannelTxt.value) {
        desNotEmpty = true;
      }
    }
    browser.assert.ok(desNotEmpty, 'Every video has title');

    const likedButtonEls = await browser.elements('css selector', '#videoscreen section.videolist .stats__item.likeSlider.videolist--desktop');
    let likeButtonIsNotEpmty = false;
    for (const btnEl of likedButtonEls.value) {
      const btn = await browser.elementIdElement(Object.values(btnEl)[0], 'css selector', ' svg.icon-stats:not(.hidden)');
      const displayBtn = await browser.elementIdCssProperty(Object.values(btn.value)[0], 'display');
      if (displayBtn.value !== 'none') {
        likeButtonIsNotEpmty = true;
      }
    }

    browser.assert.ok(likeButtonIsNotEpmty, 'Every video has like button');
  },
  'Check if each video has title, description, share/like icon in GRID mode': async (browser) => {
    const page = browser.page.discoverypage();
    page.clickElement('@changeTypeListBtn');
    browser.pause(2000);
    await browser.waitForElementVisible('#videoscreen section.videogrid', 5000, 'Channel list is shown');

    const titleChannelEls = await browser.elements('css selector', '#videoscreen section.videogrid .videogrid__item .artist__info .artist__name');
    let titleNotEmpty = false;
    for (const titleEl of titleChannelEls.value) {
      const titleChannelEl = await browser.elementIdText(Object.values(titleEl)[0]);
      if (titleChannelEl.value) {
        titleNotEmpty = true;
      }
    }
    browser.assert.ok(titleNotEmpty, 'Every video has title');

    const desChannelEls = await browser.elements('css selector', '#videoscreen section.videogrid .videogrid__item .artist__info .discover__title');
    let desNotEmpty = false;
    for (const desEl of desChannelEls.value) {
      const desChannelTxt = await browser.elementIdText(Object.values(desEl)[0]);
      if (desChannelTxt.value) {
        desNotEmpty = true;
      }
    }
    browser.assert.ok(desNotEmpty, 'Every video has description');

    const likedButtonEls = await browser.elements('css selector', '#videoscreen section.videogrid .videogrid__actions .stats__item');
    let likeButtonIsNotEpmty = false;
    for (const btnEl of likedButtonEls.value) {
      const btn = await browser.elementIdElement(Object.values(btnEl)[0], 'css selector', ' svg.icon-stats:not(.hidden)');
      const displayBtn = await browser.elementIdCssProperty(Object.values(btn.value)[0], 'display');
      if (displayBtn.value !== 'none') {
        likeButtonIsNotEpmty = true;
      }
    }

    browser.assert.ok(likeButtonIsNotEpmty, 'Every video has like button');
  },
  'Check if show more work': async (browser) => {
    const page = browser.page.discoverypage();
    await browser.waitForElementVisible('#videoscreen section.videogrid', 5000, 'Channel list is shown');
    await browser.waitForElementVisible('#videoscreen .pagination .paginDiscover', 5000, 'The load more button is shown');
    const videoEls = await browser.elements('css selector', '#videoscreen section.videogrid .videogrid__item');
    const numberOfVideoBeforeLoadMore = videoEls.value.length;
    page.clickElement('@loadMoreBtn');
    browser.pause(5000);
    const videoAfterLoadMoreEls = await browser.elements('css selector', '#videoscreen section.videogrid .videogrid__item');
    const numberOfVideoAfterLoadMore = videoAfterLoadMoreEls.value.length;

    browser.assert.ok(numberOfVideoBeforeLoadMore < numberOfVideoAfterLoadMore, 'Testing if number of video is greater after click load more button');
  },
};