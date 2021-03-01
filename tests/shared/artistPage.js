const constants = require('../../constants');
const axios = require('axios');
const {JSDOM} = require('jsdom');

module.exports = {
  'Check if top slider shows artist name, description, artist image': async (browser) => {
    browser.waitForElementVisible('.singers.mainPage .autoSlider-container');
    const topSliderItems = await browser.elements('css selector', '.singers.mainPage .autoSlider-container .topSliderItem');
    const atleastOneItemHasShown = [];
    for (const sliderItem of topSliderItems.value) {
      const display = await browser.elementIdCssProperty(Object.values(sliderItem)[0], 'display');
      (display.value === 'block') && atleastOneItemHasShown.push(display);
    }
    browser.assert.ok(!!atleastOneItemHasShown.length, 'Atleast one slider has been shown');
    let eachImageHasSrc = true;
    let nameArtistIsnotEmpty = true;
    let desArtistIsnotEmpty = true;
    for (const sliderItem of topSliderItems.value) {
      const imgSliderItem = await browser.elementIdElement(Object.values(sliderItem)[0], 'css selector', '.slide-image img');
      const imgSliderSrc = await browser.elementIdAttribute(Object.values(imgSliderItem.value)[0], 'src');
      if (!imgSliderSrc.value ) {
        eachImageHasSrc = false;
        break;
      }

      const artistNameEl = await browser.elementIdElement(Object.values(sliderItem)[0], 'css selector', '.singer-subtitle-slider .singer-title .singerName');
      const artistName = await browser.elementIdAttribute(Object.values(artistNameEl.value)[0], 'innerHTML');
      if (!artistName.value) {
        nameArtistIsnotEmpty = false;
        break;
      }

      const artistDesEl = await browser.elementIdElement(Object.values(sliderItem)[0], 'css selector', '.singer-subtitle-slider .singer-header');
      const artistDes = await browser.elementIdAttribute(Object.values(artistDesEl.value)[0], 'innerHTML');
      if (!artistDes.value) {
        desArtistIsnotEmpty = false;
        break;
      }
      browser.pause(1000);
    }
    browser.assert.ok(eachImageHasSrc, 'Top slider has shown image');
    browser.assert.ok(nameArtistIsnotEmpty, 'Top slider has shown the artist name');
    browser.assert.ok(desArtistIsnotEmpty, 'Top slider has shown the description of artist');
  },
  'Check search is work': async (browser) => {
    const page = browser.page.artistspage();
    page.clickElement('@searchInput');
    const searchTxt = 'DR';
    page.setInput('@searchInput', searchTxt);
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
    const page = browser.page.artistspage();
    page.clickElement('@filterCategoriesDropdown');
    browser.assert.visible('.singers-category .filter__dropdown-menu.dropdown-menu', 'The items of filter category have been show');
    page.clickElement('@filterCategoriesItem');
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
    const page = browser.page.artistspage();
    page.clickElement('@sortDropdown');
    browser.assert.visible('.singers-header-menu .discover__filter-item:not(.singers-category) .filter__dropdown-menu.dropdown-menu', 'The items of sort dropdown have been show');
    page.clickElement('@sortItem');
    browser.pause(2000);
    const sort = await page.getDataSortOfFilterItem('@sortItem');
    const categoryId = await page.getDataIdOfFilterItem('@filterCategoriesItem');
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
  'Check table/list view mode': async (browser) => {
    const page = browser.page.artistspage();
    const dataTypeOfChangeTypeBtn = await browser.getAttribute('.changeTypeList', 'data-type');

    browser.assert.ok(dataTypeOfChangeTypeBtn.value === 'list', 'The grid view is show first');
    browser.assert.cssProperty('.singers.mainPage #videoscreen section.videogrid', 'display', 'grid');
    page.clickElement('@changeTypeBtn');
    browser.pause(5000);
    const dataTypeOfChangeTypeBtnAfterSwitch = await browser.getAttribute('.changeTypeList', 'data-type');
    browser.assert.ok(dataTypeOfChangeTypeBtnAfterSwitch.value === 'table', 'The table view is shown');
    browser.assert.cssProperty('.singers.mainPage #videoscreen section.videolist', 'display', 'block');
    browser.refresh();
    const dataTypeOfChangeTypeBtnAfterRefresh = await browser.getAttribute('.changeTypeList', 'data-type');
    browser.assert.ok(dataTypeOfChangeTypeBtnAfterRefresh.value === 'table', 'The table view is still shown after refresh');
  },
  'Check if each artist item has aritst name, number of videos, time duration, like icon in LIST mode': async (browser) => {
    const titlesOfVideoEls = await browser.elements('css selector',
        '.singers.mainPage #videoscreen section.videolist .singers_list-gallery-item .singers-gallery-title');
    let titleNotEmpty = false;
    for (const titleEl of titlesOfVideoEls.value) {
      const titleChannelEl = await browser.elementIdText(Object.values(titleEl)[0]);
      if (titleChannelEl.value) {
        titleNotEmpty = true;
      }
    }
    browser.assert.ok(titleNotEmpty, 'Every video has the title');

    const numberVideoOfVideoEls = await browser.elements('css selector',
        '.singers.mainPage #videoscreen section.videolist .singers_list-gallery-item .singers_list-gallery-text');

    let numberVideoNotEmpty = false;
    for (const numberVideoEl of numberVideoOfVideoEls.value) {
      const numberVideoTxtEl = await browser.elementIdText(Object.values(numberVideoEl)[0]);
      if (numberVideoTxtEl.value) {
        numberVideoNotEmpty = true;
      }
    }
    browser.assert.ok(numberVideoNotEmpty, 'Every video has the number');

    const durationVideoOfVideoEls = await browser.elements('css selector',
        '.singers.mainPage #videoscreen section.videolist .singers_list-gallery-item .time-status__time');

    let durationVideoNotEmpty = false;
    for (const durationVideoEl of durationVideoOfVideoEls.value) {
      const durationTxtEl = await browser.elementIdText(Object.values(durationVideoEl)[0]);
      if (durationTxtEl.value) {
        durationVideoNotEmpty = true;
      }
    }
    browser.assert.ok(durationVideoNotEmpty, 'Every video has the duration');

    const likeBtnOfVideoEls = await browser.elements('css selector',
        '.singers.mainPage #videoscreen section.videolist .singers_list-gallery-item .artistLike');

    let likeBtnVideoNotEmpty = false;
    for (const likeBtn of likeBtnOfVideoEls.value) {
      const likeBtnDisplay = await browser.elementIdCssProperty(Object.values(likeBtn)[0], 'display');
      if (likeBtnDisplay.value === 'flex') {
        likeBtnVideoNotEmpty = true;
      }
    }
    browser.assert.ok(likeBtnVideoNotEmpty, 'Every video has the like button');
  },
  'Check if each artist item has aritst name, number of videos, time duration, like icon in GRID mode': async (browser) => {
    const page = browser.page.artistspage();
    page.clickElement('@changeTypeBtn');
    browser.pause(5000);
    const titlesOfVideoEls = await browser.elements('css selector',
        '.singers.mainPage #videoscreen section.videogrid .singers-gallery-item .singers-gallery-title');
    let titleNotEmpty = false;
    for (const titleEl of titlesOfVideoEls.value) {
      const titleChannelEl = await browser.elementIdText(Object.values(titleEl)[0]);
      if (titleChannelEl.value) {
        titleNotEmpty = true;
      }
    }
    browser.assert.ok(titleNotEmpty, 'Every video has the title');
    const numberVideoOfVideoEls = await browser.elements('css selector',
        '.singers.mainPage #videoscreen section.videogrid .singers-gallery-item .singers-gallery-details-text');

    let numberVideoNotEmpty = false;
    for (const numberVideoEl of numberVideoOfVideoEls.value) {
      const numberVideoTxtEl = await browser.elementIdText(Object.values(numberVideoEl)[0]);
      if (numberVideoTxtEl.value) {
        numberVideoNotEmpty = true;
      }
    }
    browser.assert.ok(numberVideoNotEmpty, 'Every video has the number');

    const durationVideoOfVideoEls = await browser.elements('css selector',
        '.singers.mainPage #videoscreen section.videogrid .singers-gallery-item .time-status__time');

    let durationVideoNotEmpty = false;
    for (const durationVideoEl of durationVideoOfVideoEls.value) {
      const durationTxtEl = await browser.elementIdText(Object.values(durationVideoEl)[0]);
      if (durationTxtEl.value) {
        durationVideoNotEmpty = true;
      }
    }
    browser.assert.ok(durationVideoNotEmpty, 'Every video has the duration');

    const likeBtnOfVideoEls = await browser.elements('css selector',
        '.singers.mainPage #videoscreen section.videogrid .singers-gallery-item .artistLike');

    let likeBtnVideoNotEmpty = false;
    for (const likeBtn of likeBtnOfVideoEls.value) {
      const likeBtnDisplay = await browser.elementIdCssProperty(Object.values(likeBtn)[0], 'display');
      if (likeBtnDisplay.value === 'flex') {
        likeBtnVideoNotEmpty = true;
      }
    }
    browser.assert.ok(likeBtnVideoNotEmpty, 'Every video has the like button');
  },
  'Check if show more work': async (browser) => {
    const artistPage = browser.page.artistspage();
    artistPage.navigate();
    const loadMoreBtn = await await browser.element('css selector',
        '.singers.mainPage #videoscreen section.videogrid .singers-gallery-item');
    if (loadMoreBtn.value) {
      const numberOfVideoBeforeLoadmore = await browser.elements('css selector',
          '.singers.mainPage #videoscreen section.videogrid .singers-gallery-item');

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