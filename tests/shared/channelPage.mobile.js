const axios = require('axios');
const constants = require('../../constants');
const {JSDOM} = require('jsdom');
const channelPage = require('./channelPage');

module.exports = {
  ...channelPage,
  'Check if filter are shown and works': async (browser) => {
    const page = browser.page.channelpage();
    page.clickElement('@toggleFilterMb');
    await browser.waitForElementVisible('.filter-mob.mobileFilter', 2000, 'Check if filter are shown');
    await browser.moveToElement('#channelsContent .cards:nth-of-type(2)', 10 , 10);
    page.clickElement('@filterBtnMb');
    browser.assert.cssProperty('.mobileFilter .filter__dropdown-menu.dropdown-menu', 'display', 'block');
    page.clickElement('@filterItemMb');
    browser.pause(2000);
    const filterItemValue = await page.getDataValueOfFilterItem('@filterItemMb');
    const tokenAPI = await browser.getValue('input[name="_token"]');
    const ceekSession = await browser.getCookie('ceek_session');

    const response = await axios.post(constants.FILTER_CHANNELS,
        {
          'page': 1,
          'search': '',
          'target': 'popular',
          'value': filterItemValue.value,
          '_token': tokenAPI.value
        }, {
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
    page.clickElement('@toggleFilterMb');
    await browser.waitForElementVisible('.filter-mob.mobileFilter', 2000, 'Check if filter are shown');
    const searchTxt = 'test';
    page.setInput('@headerSearchbarMb', searchTxt);

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
    await browser.moveToElement('.vr-headset__inner', 10 , 10);
    page.clickElement('@loadMoreBtn');
    browser.pause(3000);
    const cardItemElsAfterClickLoadmore = await browser.elements('css selector', '#channelsContent .cards');
    const numberOfCardAfterLoadMore = cardItemElsAfterClickLoadmore.value.length;
    browser.assert.ok(numberOfCardAfterLoadMore > numberOfCardBeforeLoadMore, 'Testing if the card items has been increase after click load more button');
  },
}