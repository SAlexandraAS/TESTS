const axios = require('axios');
const constants = require('../../constants');
const {JSDOM} = require('jsdom');
const channelDetailPage = require('./channelDetailPage');

module.exports = {
  ...channelDetailPage,
  'Check search and filter works': async (browser) => {
    browser.pause(6000); // wait load items
    const page = browser.page.channeldetailpage();
    await browser.waitForElementNotVisible('.preloader.load', 5000);
    await browser.click('.discover__wrap .btn.showMobileFilter');
    await browser.waitForElementVisible('.channels-inside .mobileFilter', 5000);
    const searchTxt = 'johnny';
    page.setInput('@channelDetailSearchBarMb', searchTxt);
    await browser.moveToElement('.channels-inside .mobileScreenContainer article:nth-of-type(2)', 10 , 10);
    page.clickElement('@filterDropdownMb');
    page.clickElement('@fillerDropdownTrendingItemMb');

    browser.pause(2000);

    const tokenAPI = await browser.getValue('input[name="_token"]');
    const ceekSession = await browser.getCookie('ceek_session');
    const response = await axios.post(`${constants.FILTER_CHANNEL}${constants.CHANNEL_ID}/`,
        {
          'search': searchTxt,
          'page': 1,
          'sort': 'Popular',
          '_token': tokenAPI.value,
        }, {
          withCredentials: true,
          headers: {
            'cookie': `ceek_session=${ceekSession.value}`,
            'x-csrf-token': tokenAPI.value,
          },
        });

    browser.assert.ok(response.status === 200, 'Status API "filter-change" is OK');
    browser.assert.ok(response.data.view != undefined, 'Response of API "filter-change" is OK');
    const htmlFromResult = response.data.view;

    const dom = new JSDOM(htmlFromResult);
    const articleFromServer = dom.window.document.querySelectorAll('.videogrid article');
    const articleInBrowser = await browser.elements('css selector', '.channels-inside .videogrid article');
    browser.assert.ok(articleInBrowser.value.length === articleFromServer.length, 'The item return from API equals with the item on browser');
  },
};