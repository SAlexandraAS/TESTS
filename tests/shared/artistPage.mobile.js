const constants = require('../../constants');
const axios = require('axios');
const {JSDOM} = require('jsdom');
const artistPage = require('./artistPage');
module.exports = {
  ...artistPage,
  'Check search is work': async (browser) => {
    browser.pause(6000); // wait load items
    const page = browser.page.artistspage();
    await browser.click('.singers-header-menu .btn.showMobileFilter');
    page.clickElement('@searchInputMb');
    const searchTxt = 'DR';
    page.setInput('@searchInputMb', searchTxt);
    browser.pause(2000);
    const tokenAPI = await browser.getAttribute('meta[name="csrf-token"]', 'content');
    const ceekSession = await browser.getCookie('ceek_session');
    const response = await axios.post(`${constants.ARTIST_CHANNEL}`,
        {
          'search': searchTxt,
          'category': '',
          'orderBy': 'All',
          'page': 1,
          '_token': tokenAPI.value,
        }, {
          withCredentials: true,
          headers: {
            'cookie': `ceek_session=${ceekSession.value}`,
            'x-csrf-token': tokenAPI.value,
          },
        });

    browser.assert.ok(response.status === 200, 'Status API "artist-filter" is OK');
    browser.assert.ok(response.data.view != undefined, 'Response of API "artist-filter" is OK');
    const htmlFromResult = response.data.view;

    const dom = new JSDOM(htmlFromResult);
    const filterItemsReturnFromServer = dom.window.document.querySelectorAll('li.singers-gallery-item');
    const itemsInBrowser = await browser.elements('css selector', '.singers.mainPage #videoscreen .videogrid .singers-gallery-item');

    browser.assert.ok(itemsInBrowser.value.length === filterItemsReturnFromServer.length, `Search ${searchTxt} : The item return from API equals with the item on browser`);
  },
  'Check filter category is work': async (browser) => {
    browser.pause(6000); // wait load items
    const page = browser.page.artistspage();
    await browser.click('.singers-header-menu .btn.showMobileFilter');
    await browser.moveToElement('.singers.mainPage #videoscreen .mobileScreenContainer .showSingerInfo:nth-of-type(2)', 10, 10);
    page.clickElement('@filterCategoriesDropdownMb');
    browser.assert.visible('.mobileFilter .filter-mob__item .filter__dropdown-menu.dropdown-menu.show', 'The items of filter category have been show');
    page.clickElement('@filterCategoriesItemMb');
    browser.pause(2000);
    const categoryId = await page.getDataIdOfFilterItem('@filterCategoriesItem');
    const searchTxt = 'DR';
    const tokenAPI = await browser.getAttribute('meta[name="csrf-token"]', 'content');
    const ceekSession = await browser.getCookie('ceek_session');
    const responseByFilterCategory = await axios.post(`${constants.ARTIST_CHANNEL}`,
        {
          'search': searchTxt,
          'category': categoryId.value,
          'orderBy': 'All',
          'page': 1,
          '_token': tokenAPI.value,
        }, {
          withCredentials: true,
          headers: {
            'cookie': `ceek_session=${ceekSession.value}`,
            'x-csrf-token': tokenAPI.value,
          },
        });

    browser.assert.ok(responseByFilterCategory.status === 200, 'Status API "artist-filter" is OK');
    browser.assert.ok(responseByFilterCategory.data.view != undefined, 'Response of API "artist-filter" is OK');
    const htmlFromResultByFilterCategory = responseByFilterCategory.data.view;

    const domtByFilterCategory = new JSDOM(htmlFromResultByFilterCategory);
    const filterItemsReturnFromServerByFilterCategory = domtByFilterCategory.window.document.querySelectorAll('li.singers-gallery-item');
    const itemsInBrowserByFilterCategory = await browser.elements('css selector', '.singers.mainPage #videoscreen .videogrid .singers-gallery-item');
    browser.assert.ok(itemsInBrowserByFilterCategory.value.length === filterItemsReturnFromServerByFilterCategory.length,
        `Testing if search ${searchTxt} and Filter with category id ${categoryId.value}: The item return from API equals with the item on browser`);
  },
  'Check sort is work': async (browser) => {
    browser.pause(6000); // wait load items
    const page = browser.page.artistspage();
    await browser.click('.singers-header-menu .btn.showMobileFilter');
    await browser.moveToElement('.singers.mainPage #videoscreen .mobileScreenContainer .showSingerInfo:nth-of-type(2)', 10, 10)

    page.clickElement('@sortDropdownMb');
    page.clickElement('@sortItemMb');
    browser.pause(2000);
    const sort = await page.getDataSortOfFilterItem('@sortItemMb');
    const categoryId = await page.getDataIdOfFilterItem('@filterCategoriesItemMb');
    const searchTxt = 'DR';
    const tokenAPI = await browser.getAttribute('meta[name="csrf-token"]', 'content');
    const ceekSession = await browser.getCookie('ceek_session');

    const responseByFilterCategoryAndSort = await axios.post(`${constants.ARTIST_CHANNEL}`,
        {
          'search': searchTxt,
          'category': categoryId.value,
          'orderBy': sort.value,
          'page': 1,
          '_token': tokenAPI.value,
        }, {
          withCredentials: true,
          headers: {
            'cookie': `ceek_session=${ceekSession.value}`,
            'x-csrf-token': tokenAPI.value,
          },
        });

    browser.assert.ok(responseByFilterCategoryAndSort.status === 200, 'Status API "artist-filter" is OK');
    browser.assert.ok(responseByFilterCategoryAndSort.data.view != undefined, 'Response of API "artist-filter" is OK');

    const htmlFromResultByFilterCategoryAndSort = responseByFilterCategoryAndSort.data.view;

    const domByFilterCategoryAndSort = new JSDOM(htmlFromResultByFilterCategoryAndSort);
    const filterItemsReturnFromServerByFilterCategoryAndSort = domByFilterCategoryAndSort.window.document.querySelectorAll('li.singers-gallery-item');
    const itemsInBrowserByFilterCategoryAndSort = await browser.elements('css selector', '.singers.mainPage #videoscreen .videogrid .singers-gallery-item');

    const dataUrlOfItemInfilterItemsReturnFromServer = [];
    for (const item of filterItemsReturnFromServerByFilterCategoryAndSort) {
      dataUrlOfItemInfilterItemsReturnFromServer.push(item.getAttribute('data-id'));
    }
    const dataUrlOfItemsInBrowser = [];
    for (const item of itemsInBrowserByFilterCategoryAndSort.value) {
      const result = await browser.elementIdAttribute(Object.values(item)[0], 'data-id');
      dataUrlOfItemsInBrowser.push(result.value);
    }
    let arraysIsEquals = true;
    for (let i = 0; i < dataUrlOfItemsInBrowser.length; ++i) {
      if (dataUrlOfItemInfilterItemsReturnFromServer[i] !== dataUrlOfItemsInBrowser[i]) {
        arraysIsEquals = false;
      }
    }

    browser.assert.ok(arraysIsEquals, 'The index of item in browser and items from server are correctly. The sort is working');
  },
  'Check if show more work': async (browser) => {
    const artistPage = browser.page.artistspage();
    artistPage.navigate();
    
    const loadMoreBtn = await browser.element('css selector',
        '.singers.mainPage #videoscreen section.videogrid .singers-gallery-item');
    if (loadMoreBtn.value) {
      const numberOfVideoBeforeLoadmore = await browser.elements('css selector',
          '.singers.mainPage #videoscreen section.videogrid .singers-gallery-item');
      await browser.moveToElement('.vr-headset__inner', 10 , 10);
      artistPage.clickElement('@loadMoreBtn');
      browser.pause(3000);
      const numberOfVideoAfterLoadmore = await browser.elements('css selector',
          '.singers.mainPage #videoscreen section.videogrid .singers-gallery-item');
      browser.assert.ok(numberOfVideoAfterLoadmore.value > numberOfVideoBeforeLoadmore.value, 'The loadmore has worked');
    } else {
      console.log('The loadmore button is not showing');
    }
  },
};