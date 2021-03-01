const axios = require('axios');
const constants = require('../../constants');
const {JSDOM} = require('jsdom');

module.exports = {
  'Check if channel title and image is shown at the top': async (browser) => {
    await browser.waitForElementVisible('.channels__top');
    const srcMainImage = await browser.getAttribute('.channels__top .channel-mainImage img', 'src');
    browser.assert.ok(srcMainImage.value, 'Image is shown at the top');
    const titleTopOfpage = await browser.getText('.channels__top .channel-title .channelName');
    browser.assert.ok(titleTopOfpage.value, 'Title is shown at the top');
  },
  'Check back button shows and work': async (browser) => {
    await browser.waitForElementVisible('.channels-inside .channels__header');
    const page = browser.page.channeldetailpage();
    browser.pause(5000);
    page.click('@backBtn');
    browser.pause(5000);
    browser.assert.urlEquals(constants.CHANNEL_PAGE, 'Browser back to channel list');
  },
  'Check channel icon, channel name is shown': async (browser) => {
    await browser.waitForElementVisible('.channels__header img.iconChannel-info');
    const iconSrc = await browser.getAttribute('.channels__header img.iconChannel-info', 'src');
    browser.assert.ok(iconSrc.value, 'The icon of channel is shown');
    await browser.waitForElementVisible('.channels__header h3.channelTitle-info');
    const title = await browser.getText('.channels__header h3.channelTitle-info');
    browser.assert.ok(title.value, 'The title of channel is shown');
  },
  'Check search and filter works': async (browser) => {
    const page = browser.page.channeldetailpage();

    await browser.waitForElementNotVisible('.preloader.load', 2000);
    const searchTxt = 'johnny';
    page.click('@channelDetailSearchBar');
    page.setInput('@channelDetailSearchBar', searchTxt);
    page.clickElement('@filterDropdown');
    page.clickElement('@fillerDropdownTrendingItem');

    browser.pause(2000);

    const tokenAPI = await browser.getValue('input[name="_token"]');
    const ceekSession = await browser.getCookie('ceek_session');
    const response = await axios.post(`${constants.FILTER_CHANNEL}${constants.CHANNEL_ID}/`,
        {
          'search': searchTxt,
          'page': 1,
          'sort': 'Trending',
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
  'Check every video in the channel has cover image, time duration, artist, video title, like icon': async (browser) => {
    browser.refresh();
    console.log('====> Every video has the cover img');
    const coverImgVideoInChannelEls = await browser.elements('css selector', '.channels-inside .dataChannel article img');
    let coverImgIsShown = false;
    for (const coverImgEl of coverImgVideoInChannelEls.value) {
      const coverImgSrc = await browser.elementIdAttribute(Object.values(coverImgEl)[0], 'src');
      if (coverImgSrc.value) {
        coverImgIsShown = true;
      }
    }
    browser.assert.ok(coverImgIsShown, 'Every video has the cover img');

    console.log('====> Every video has the duration');
    const durationVideoInChannelEls = await browser.elements('css selector', '.channels-inside .dataChannel article .time-status .time-status__time');
    let durationVideoIsShown = false;
    for (const durationEl of durationVideoInChannelEls.value) {
      const duration = await browser.elementIdText(Object.values(durationEl)[0]);
      if (duration.value) {
        durationVideoIsShown = true;
      }
    }
    browser.assert.ok(durationVideoIsShown, 'Every video has the duration');

    console.log('====> Every video has the artist');
    const artistVideoInChannelEls = await browser.elements('css selector', '.channels-inside .dataChannel article .videogrid-info .artist__name');
    let artistVideoIsShown = false;
    for (const artistVideoEl of artistVideoInChannelEls.value) {
      const artistVideo = await browser.elementIdText(Object.values(artistVideoEl)[0]);
      if (artistVideo.value) {
        artistVideoIsShown = true;
      }
    }
    browser.assert.ok(artistVideoIsShown, 'Every video has the artist');

    console.log('====> Every video has the title');
    const titleVideoInChannelEls = await browser.elements('css selector', '.channels-inside .dataChannel article .videogrid-info .videogrid__title .playChannel');
    let titleVideoIsShown = false;
    for (const titleVideoEl of titleVideoInChannelEls.value) {
      const titleVideo = await browser.elementIdText(Object.values(titleVideoEl)[0]);
      if (titleVideo.value) {
        titleVideoIsShown = true;
      }
    }
    browser.assert.ok(titleVideoIsShown, 'Every video has the title');

    console.log('====> Every video has the liked button');
    const likeBtnLiveInChannelEls = await browser.elements('css selector', '.channels-inside .dataChannel article .videogrid-info .videogrid__actions .likeProgram');
    const likeBtnVideoInChannelEls = await browser.elements('css selector', '.channels-inside .dataChannel article .videogrid-info .videogrid__actions .likeSlider');
    let likeBtnVideoIsShown = false;
    for (const likeBtnEl of [...likeBtnLiveInChannelEls.value, ...likeBtnVideoInChannelEls.value]) {
      const likeBtnVideo = await browser.elementIdElement(Object.values(likeBtnEl)[0], 'css selector', ' svg.not-liked');
      if (likeBtnVideo.value) {
        likeBtnVideoIsShown = true;
      }
    }
    browser.assert.ok(likeBtnVideoIsShown, 'Every video has the liked button');
  },
};