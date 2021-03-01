const axios = require('axios');
const constants = require('../../constants');
const {JSDOM} = require('jsdom');

module.exports = {
  'Check header and footer are shown': async (browser) => {
    await browser.waitForElementVisible('.header', 2000, '[1.1]  Check header are shown');
    await browser.waitForElementVisible('.footer', 2000, '[1.2]  Check footer are shown');
  },
  'Check if promotion banner is shown.': async (browser) => {
    await browser.waitForElementNotVisible('.preloader.load', 2000);
    browser.assert.elementPresent('.advertising.bannerItem:not(.hidden)', 'Testing if the top promotion banner was showing.');
  },
  'Check if filter are shown and works': async (browser) => {
    const page = browser.page.channelpage();
    await browser.waitForElementVisible('.input.filter__input', 2000, 'Check if filter are shown');
    page.clickElement('@filterBtn');
    browser.assert.cssProperty('.filter__dropdown-menu.dropdown-menu', 'display', 'block');

    page.clickElement('@filterItem');
    browser.pause(2000);
    const filterItemValue = await page.getDataValueOfFilterItem('@filterItem');
    const tokenAPI = await browser.getValue('input[name="_token"]');
    const ceekSession = await browser.getCookie('ceek_session');

    const response = await axios.post(constants.FILTER_CHANNELS,
        {'search': '',
          'target': 'length',
          'value': filterItemValue.value,
          'page': 1,
          '_token': tokenAPI.value}, {
          withCredentials: true,
          headers: {
            'cookie': `ceek_session=${ceekSession.value}`,
            'x-csrf-token': tokenAPI.value,
          },
        });


    browser.assert.ok(response.status === 200, 'Status API "filter-change" is OK');
    browser.assert.ok(response.data.result != undefined, 'Response of API "filter-change" is OK');
    const htmlFromResult = response.data.result;

    const dom = new JSDOM(htmlFromResult);
    const filterItemsReturnFromServer = dom.window.document.querySelectorAll('.cards');

    const itemsInBrowser = await browser.elements('css selector', '#channelsContent .cards');

    browser.assert.ok(itemsInBrowser.value.length === filterItemsReturnFromServer.length, 'The item return from API equals with the item on browser');
    const dataUrlOfItemInfilterItemsReturnFromServer = [];
    for (const item of filterItemsReturnFromServer) {
      dataUrlOfItemInfilterItemsReturnFromServer.push(item.getAttribute('data-url'));
    }
    const dataUrlOfItemsInBrowser = [];
    for (const item of itemsInBrowser.value) {
      const result = await browser.elementIdAttribute(Object.values(item)[0], 'data-url');
      dataUrlOfItemsInBrowser.push(result.value);
    }
    let arraysIsEquals = true;
    for (let i = 0; i < dataUrlOfItemsInBrowser.length; ++i) {
      if (dataUrlOfItemInfilterItemsReturnFromServer[i] !== dataUrlOfItemsInBrowser[i]) {
        arraysIsEquals = false;
      }
    }

    browser.assert.ok(arraysIsEquals, 'The index of item in browser and items from server are correctly. The filter is working');
  },
  'Check search bar are shown and works': async (browser) => {
    const page = browser.page.channelpage();
    await browser.waitForElementVisible('.channels__form .input.singers-search', 2000, 'Check if search bar are shown');
    const searchTxt = 'test';
    page.setInput('@headerSearchbar', searchTxt);

    browser.pause(2000);
    const tokenAPI = await browser.getValue('input[name="_token"]');
    const ceekSession = await browser.getCookie('ceek_session');

    const response = await axios.post(constants.FILTER_CHANNELS,
        {'search': searchTxt,
          'target': 'length',
          'value': '-1',
          'page': 1,
          '_token': tokenAPI.value}, {
          withCredentials: true,
          headers: {
            'cookie': `ceek_session=${ceekSession.value}`,
            'x-csrf-token': tokenAPI.value,
          },
        });


    browser.assert.ok(response.status === 200, 'Status API "filter-change" is OK');
    browser.assert.ok(response.data.result != undefined, 'Response of API "filter-change" is OK');
    const htmlFromResult = response.data.result;

    const dom = new JSDOM(htmlFromResult);
    const filterItemsReturnFromServer = dom.window.document.querySelectorAll('.cards');

    const itemsInBrowser = await browser.elements('css selector', '#channelsContent .cards');

    browser.assert.ok(itemsInBrowser.value.length === filterItemsReturnFromServer.length, 'The item return from API equals with the item on browser');
  },
  'Check if Show More works': async (browser) => {
    browser.waitForElementVisible('.channels .pagination a.paginChannels', 5000, 'Testing if the load more button is visible');
    const cardItemEls = await browser.elements('css selector', '#channelsContent .cards');
    const numberOfCardBeforeLoadMore = cardItemEls.value.length;
    const page = browser.page.channelpage();
    page.clickElement('@loadMoreBtn');
    browser.pause(3000);
    const cardItemElsAfterClickLoadmore = await browser.elements('css selector', '#channelsContent .cards');
    const numberOfCardAfterLoadMore = cardItemElsAfterClickLoadmore.value.length;
    browser.assert.ok(numberOfCardAfterLoadMore > numberOfCardBeforeLoadMore, 'Testing if the card items has been increase after click load more button');
  },
  'Check if table/list view mode works': async (browser) => {
    const page = browser.page.channelpage();
    const changeTypeListBtn = await browser.getAttribute('.singers-header-menu a.changeTypeList', 'data-type');
    browser.assert.ok(changeTypeListBtn.value === 'list', 'The button switch to "list" mode should be enable at init');
    browser.assert.domPropertyEquals('#channelsContent', 'className', 'videogrid', 'The grid mode should be visible at init');
    page.clickElement('@changeTypeListBtn');
    browser.pause(5000);
    const changeTypeListBtn2 = await browser.getAttribute('.singers-header-menu a.changeTypeList', 'data-type');


    browser.assert.ok(changeTypeListBtn2.value === 'table', 'The button switch to "grid" mode should be enable after switch to list');
    browser.assert.domPropertyEquals('#channelsContent', 'className', 'videolist', 'The list mode should be visible after switch to list');
    browser.refresh();
    browser.assert.ok(changeTypeListBtn2.value === 'table', 'The button switch to "grid" mode should still be enable after refresh');
    browser.assert.domPropertyEquals('#channelsContent', 'className', 'videolist', 'The list mode should be visible after refresh');
  },
  'Check if every channel in LIST mode has title, number of videos, time length, love icon': async (browser) => {
    browser.pause(2000);
    await browser.waitForElementVisible('#channelsContent', 2000, 'Channel list is shown');
    const titleChannelEls = await browser.elements('css selector', '#channelsContent .channels-list__wrap .channels-list-content .channels-list__title');
    let titleNotEmpty = false;
    for (const titleEl of titleChannelEls.value) {
      const titleChannelEl = await browser.elementIdText(Object.values(titleEl)[0]);
      if (titleChannelEl.value) {
        titleNotEmpty = true;
      }
    }
    browser.assert.ok(titleNotEmpty, 'Every channel has title');

    const infoChannelEls = await browser.elements('css selector', '#channelsContent .channels-list__wrap .channels-list-content .channels__videos-text');
    let numberVideoOfChannelNotEmpty = false;
    for (const el of infoChannelEls.value) {
      const numberOfVideo = await browser.elementIdText(Object.values(el)[0]);
      if (numberOfVideo.value) {
        numberVideoOfChannelNotEmpty = true;
      }
    }
    browser.assert.ok(numberVideoOfChannelNotEmpty, 'Every channel has number of video');

    const statusChannelEls = await browser.elements('css selector', '#channelsContent .channels-list__wrap .channels-list-content .time-status.channels-list__time-status .time-status__time');
    let timeLengthOfChannelNotEmpty = false;
    for (const statusEl of statusChannelEls.value) {
      const timeLength = await browser.elementIdText(Object.values(statusEl)[0]);
      if (timeLength.value) {
        timeLengthOfChannelNotEmpty = true;
      }
    }
    browser.assert.ok(timeLengthOfChannelNotEmpty, 'Every channel has time length');

    const likedButtonEls = await browser.elements('css selector', '#channelsContent .channels-list__wrap .channels-list-content .channels-list-content-footer .socialsChannelList .stats__item');
    let likeButtonIsNotEpmty = false;
    for (const btnEl of likedButtonEls.value) {
      const btn = await browser.elementIdElement(Object.values(btnEl)[0], 'css selector', ' svg.icon-stats:not(.hidden)');
      const displayBtn = await browser.elementIdCssProperty(Object.values(btn.value)[0], 'display');
      if (displayBtn.value !== 'none') {
        likeButtonIsNotEpmty = true;
      }
    }

    browser.assert.ok(likeButtonIsNotEpmty, 'Every channel has like button');
  },
  'Check if every channel in GRID mode has title, number of videos, time length, love icon': async (browser) => {
    const page = browser.page.channelpage();
    page.clickElement('@changeTypeListBtn');
    browser.pause(3000);
    await browser.waitForElementVisible('#channelsContent', 2000, 'Channel list is shown');
    const titleChannelEls = await browser.elements('css selector', '#channelsContent .cards article a .titleForSearch');
    let titleNotEmpty = false;
    for (const titleEl of titleChannelEls.value) {
      const titleChannelEl = await browser.elementIdText(Object.values(titleEl)[0]);
      if (titleChannelEl.value) {
        titleNotEmpty = true;
      }
    }
    browser.assert.ok(titleNotEmpty, 'Every channel has title');

    const infoChannelEls = await browser.elements('css selector', '#channelsContent .cards article .videogrid-info .channels__wrap .channels__videos .channels__videos-text');
    let numberVideoOfChannelNotEmpty = false;
    for (const el of infoChannelEls.value) {
      const numberOfVideo = await browser.elementIdText(Object.values(el)[0]);
      if (numberOfVideo.value) {
        numberVideoOfChannelNotEmpty = true;
      }
    }
    browser.assert.ok(numberVideoOfChannelNotEmpty, 'Every channel has number of video');

    const statusChannelEls = await browser.elements('css selector', '#channelsContent .cards article .videogrid-info .channels__wrap .time-status .time-status__time');
    let timeLengthOfChannelNotEmpty = false;
    for (const statusEl of statusChannelEls.value) {
      const timeLength = await browser.elementIdText(Object.values(statusEl)[0]);
      if (timeLength.value) {
        timeLengthOfChannelNotEmpty = true;
      }
    }
    browser.assert.ok(timeLengthOfChannelNotEmpty, 'Every channel has time length');

    const likedButtonEls = await browser.elements('css selector', '#channelsContent .cards article .videogrid-info .videogrid__actions .likeChannels');
    let likeButtonIsNotEpmty = false;
    for (const btnEl of likedButtonEls.value) {
      const btn = await browser.elementIdElement(Object.values(btnEl)[0], 'css selector', ' svg.icon-stats:not(.hidden)');
      const displayBtn = await browser.elementIdCssProperty(Object.values(btn.value)[0], 'display');
      if (displayBtn.value !== 'none') {
        likeButtonIsNotEpmty = true;
      }
    }

    browser.assert.ok(likeButtonIsNotEpmty, 'Every channel has like button');
  },

  'Check if clicking each channel tumbnail goes to channel detail page': async (browser) => {
    const itemsInBrowser = await browser.elements('css selector', '#channelsContent .cards article a.video-link');
    browser.assert.ok(itemsInBrowser.value.length, 'The channel has items');
    let linkElNotContainDataIdChannel = false;
    let clickedItem = 0;
    for (const item of itemsInBrowser.value) {
      if (clickedItem >= 2) break;
      const idChannel = await browser.elementIdAttribute(Object.values(item)[0], 'data-idchannel');
      if (!idChannel.value) {
        linkElNotContainDataIdChannel = true;
        break;
      }
      browser.elementIdClick(Object.values(item)[0]);
      browser.pause(4000);
      browser.assert.urlContains(`channel/${idChannel.value}`, 'Browser navigated to right URL of channel ' + idChannel.value);
      browser.back();
      clickedItem++;
      browser.pause(4000);
    }
    browser.assert.ok(!linkElNotContainDataIdChannel, 'The link has data-idchannel');
  },
  'Check if clicking each channel tumbnail goes to channel detail page in LIST mode': async (browser) => {
    const page = browser.page.channelpage();
    page.clickElement('@changeTypeListBtn');
    browser.pause(3000);
    browser.waitForElementVisible('#channelsContent.videolist');
    const itemsInBrowser = await browser.elements('css selector', '#channelsContent article');
    browser.assert.ok(itemsInBrowser.value.length, 'The channel has items');
    let linkElNotContainDataIdChannel = false;
    let clickedItem = 0;
    for (const item of itemsInBrowser.value) {
      if (clickedItem >= 2) break;
      const idChannel = await browser.elementIdAttribute(Object.values(item)[0], 'data-idchannel');
      if (!idChannel.value) {
        linkElNotContainDataIdChannel = true;
        break;
      }
      browser.elementIdClick(Object.values(item)[0]);
      browser.pause(4000);
      browser.assert.urlContains(`channel/${idChannel.value}`, 'Browser navigated to right URL of channel ' + idChannel.value);
      browser.back();
      clickedItem++;
      browser.pause(4000);
    }
    browser.assert.ok(!linkElNotContainDataIdChannel, 'The link has data-idchannel');
  },
};