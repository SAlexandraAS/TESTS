const axios = require('axios');
const constants = require('../../constants');
const {JSDOM} = require('jsdom');

module.exports = {
  'Check if top slider shows video name, description, program poster image': async (browser) => {
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
    browser.assert.ok(eachItemHasImage && eachItemHasTitle && eachItemHasDes && atLeastAttemHasShow, 'Testing if top slider shows video name, description, program poster image');
  },
  'Check search show and work': async (browser) => {
    const page = browser.page.livepage();
    await browser.waitForElementVisible('.programs .program--is-desktop .searchProgram', 2000, 'Check if search bar are shown');
    const searchTxt = 'will';
    page.setInput('@headerSearchbar', searchTxt);

    browser.pause(2000);
    const tokenAPI = await browser.getValue('input[name="_token"]');
    const ceekSession = await browser.getCookie('ceek_session');

    const response = await axios.post(constants.FILTER_PROGRAMS,
        {
          'search': searchTxt,
          'status': 'all',
          'page': 1,
          '_token': tokenAPI.value}, {
          withCredentials: true,
          headers: {
            'cookie': `ceek_session=${ceekSession.value}`,
            'x-csrf-token': tokenAPI.value,
          },
        });


    browser.assert.ok(response.status === 200, 'Testing if status API "filter-program" is OK');
    browser.assert.ok(response.data.view != undefined, 'Testing if response of API "filter-program" is OK');
    const htmlFromResult = response.data.view;

    const dom = new JSDOM(htmlFromResult);
    const filterItemsReturnFromServer = dom.window.document.querySelectorAll('.cards');

    const itemsInBrowser = await browser.elements('css selector', '.videos-section .cards');

    browser.assert.ok(itemsInBrowser.value.length === filterItemsReturnFromServer.length, 'The item return from API equals with the item on browser');
  },
  'Check filler show and work': async (browser) => {
    const page = browser.page.livepage();
    await browser.waitForElementVisible('.program__wrap .input.filter__input', 2000, 'Testing if filter are shown');
    page.clickElement('@filterBtn');
    browser.assert.cssProperty('.program__wrap .filter__dropdown-menu.dropdown-menu', 'display', 'block');

    page.clickElement('@filterItem');
    browser.pause(2000);
    const filterItemValue = await page.getDataValueOfFilterItem('@filterItem');
    const tokenAPI = await browser.getValue('input[name="_token"]');
    const ceekSession = await browser.getCookie('ceek_session');
    const response = await axios.post(constants.FILTER_PROGRAMS,
        {
          'status': filterItemValue.value,
          'page': 1,
          '_token': tokenAPI.value,
        }, {
          withCredentials: true,
          headers: {
            'cookie': `ceek_session=${ceekSession.value}`,
            'x-csrf-token': tokenAPI.value,
          },
        });

    browser.assert.ok(response.status === 200, 'Status API "filter-program" is OK');
    browser.assert.ok(response.data.view != undefined, 'Response of API "filter-program" is OK');
    const htmlFromResult = response.data.view;
    const dom = new JSDOM(htmlFromResult);
    const filterItemsReturnFromServer = dom.window.document.querySelectorAll('.cards');
    const itemsInBrowser = await browser.elements('css selector', '.videos-section .cards');
    browser.assert.ok(itemsInBrowser.value.length === filterItemsReturnFromServer.length, 'The item return from API equals with the item on browser');
  },
  'Check table/list view mode': async (browser) => {
    const page = browser.page.livepage();
    // page.clickElement('@removefilterItem');
    browser.pause(3000);

    const changeTypeListBtn = await browser.getAttribute('.program__wrap a.changeTypeList', 'data-type');
    browser.assert.ok(changeTypeListBtn.value === 'list', 'The button switch to "list" mode should be enable at init');
    browser.assert.domPropertyContains('.program-all > section', 'className', 'videogrid', 'The grid mode should be visible at init');
    page.clickElement('@changeTypeListBtn');
    browser.pause(5000);
    const changeTypeListBtn2 = await browser.getAttribute('.program__wrap a.changeTypeList', 'data-type');


    browser.assert.ok(changeTypeListBtn2.value === 'table', 'The button switch to "grid" mode should be enable after switch to list');
    browser.assert.domPropertyContains('.program-all > section', 'className', 'videolist', 'The list mode should be visible after switch to list');
    browser.refresh();
    browser.assert.ok(changeTypeListBtn2.value === 'table', 'The button switch to "grid" mode should still be enable after refresh');
    browser.assert.domPropertyContains('.program-all > section', 'className', 'videolist', 'The list mode should be visible after refresh');
  },
  'Check if each program has title, description, event date, time duration, share/like icon in LIST mode': async (browser) => {
    browser.pause(2000);
    await browser.waitForElementVisible('.program-all section.videolist', 2000, 'Channel list is shown');

    const titleChannelEls = await browser.elements('css selector', '.program-all section.videolist .videolist__item .videolist__col--title .videoTitle');
    let titleNotEmpty = false;
    for (const titleEl of titleChannelEls.value) {
      const titleChannelEl = await browser.elementIdText(Object.values(titleEl)[0]);
      if (titleChannelEl.value) {
        titleNotEmpty = true;
      }
    }
    browser.assert.ok(titleNotEmpty, 'Every video has description');

    const desChannelEls = await browser.elements('css selector', '.program-all section.videolist .videolist__item .videolist--artist.videolist--desktop .artist-title');
    let desNotEmpty = false;
    for (const desEl of desChannelEls.value) {
      const desChannelTxt = await browser.elementIdText(Object.values(desEl)[0]);
      if (desChannelTxt.value) {
        desNotEmpty = true;
      }
    }
    browser.assert.ok(desNotEmpty, 'Every video has title');

    const eventDateChannelEls = await browser.elements('css selector', '.program-all section.videolist .videolist__item .video-artist .program-start.program-start-at');
    let eventDateNotEmpty = false;
    for (const eventDateEl of eventDateChannelEls.value) {
      const eventDateChannelTxt = await browser.elementIdText(Object.values(eventDateEl)[0]);
      if (eventDateChannelTxt.value) {
        eventDateNotEmpty = true;
      }
    }
    browser.assert.ok(eventDateNotEmpty, 'Every video has event date');

    const shareButtonEls = await browser.elements('css selector', '.program-all section.videolist .videolist__item .share-container .share-button_button svg.btn-social__share-icon');
    let shareButtonIsNotEpmty = false;
    for (const btnEl of shareButtonEls.value) {
      const displayBtn = await browser.elementIdCssProperty(Object.values(btnEl)[0], 'display');
      if (displayBtn.value !== 'none') {
        shareButtonIsNotEpmty = true;
      }
    }

    browser.assert.ok(shareButtonIsNotEpmty, 'Every video has share button');
  },
  'Check if each program has title, description, event date, time duration, share/like icon in GRID mode': async (browser) => {
    const page = browser.page.livepage();
    page.clickElement('@changeTypeListBtn');
    browser.pause(2000);
    await browser.waitForElementVisible('.program-all section.videogrid', 5000, 'Channel list is shown');

    const titleChannelEls = await browser.elements('css selector', '.program-all section.videogrid .videogrid__item .program__title .artist__name');
    let titleNotEmpty = false;
    for (const titleEl of titleChannelEls.value) {
      const titleChannelEl = await browser.elementIdText(Object.values(titleEl)[0]);
      if (titleChannelEl.value) {
        titleNotEmpty = true;
      }
    }
    browser.assert.ok(titleNotEmpty, 'Every video has title');

    const desChannelEls = await browser.elements('css selector', '.program-all section.videogrid .videogrid__item .program__title .discover__title .program-title');
    let desNotEmpty = false;
    for (const desEl of desChannelEls.value) {
      const desChannelTxt = await browser.elementIdText(Object.values(desEl)[0]);
      if (desChannelTxt.value) {
        desNotEmpty = true;
      }
    }
    browser.assert.ok(desNotEmpty, 'Every video has description');

    const eventDateChannelEls = await browser.elements('css selector', '.program-all section.videogrid .videogrid__item .program__title .discover__title .program-start-at.program-start');
    let eventDateNotEmpty = false;
    for (const eventDateEl of eventDateChannelEls.value) {
      const eventDateTxt = await browser.elementIdText(Object.values(eventDateEl)[0]);
      if (eventDateTxt.value) {
        eventDateNotEmpty = true;
      }
    }
    browser.assert.ok(eventDateNotEmpty, 'Every video has event date');

    const likedButtonEls = await browser.elements('css selector', '.program-all section.videogrid .videogrid__item .videogrid__actions .likeProgram');
    let likeButtonIsNotEpmty = false;
    for (const btnEl of likedButtonEls.value) {
      const btn = await browser.elementIdElement(Object.values(btnEl)[0], 'css selector', ' svg.icon-stats:not(.hidden)');
      const displayBtn = await browser.elementIdCssProperty(Object.values(btn.value)[0], 'display');
      if (displayBtn.value !== 'none') {
        likeButtonIsNotEpmty = true;
      }
    }

    browser.assert.ok(likeButtonIsNotEpmty, 'Every video has like button');


    const shareButtonEls = await browser.elements('css selector', '.program-all section.videogrid .videogrid__item .videogrid__actions .share-button_button svg.btn-social__share-icon');
    let shareButtonIsNotEpmty = false;
    for (const btnEl of shareButtonEls.value) {
      const displayBtn = await browser.elementIdCssProperty(Object.values(btnEl)[0], 'display');
      if (displayBtn.value !== 'none') {
        shareButtonIsNotEpmty = true;
      }
    }

    browser.assert.ok(shareButtonIsNotEpmty, 'Every video has share button');
  },
  'Check if show more work': async (browser) => {
    const page = browser.page.discoverypage();
    await browser.waitForElementVisible('.program-all section.videogrid', 5000, 'Channel list is shown');
    await browser.waitForElementVisible('.program-all .pagination #live__pagin_next', 5000, 'The load more button is shown');
    const videoEls = await browser.elements('css selector', '.program-all section.videogrid .videogrid__item');
    const numberOfVideoBeforeLoadMore = videoEls.value.length;
    page.clickElement('@loadMoreBtn');
    browser.pause(5000);
    const videoAfterLoadMoreEls = await browser.elements('css selector', '.program-all section.videogrid .videogrid__item');
    const numberOfVideoAfterLoadMore = videoAfterLoadMoreEls.value.length;

    browser.assert.ok(numberOfVideoBeforeLoadMore < numberOfVideoAfterLoadMore, 'Testing if number of video is greater after click load more button');
  },
};