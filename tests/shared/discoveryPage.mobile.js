const discoveryPage = require('./discoveryPage');
module.exports = {
  ...discoveryPage,
  'Check if show more work': async (browser) => {
    const page = browser.page.discoverypage();
    await browser.waitForElementVisible('#videoscreen section.videogrid', 5000, 'Channel list is shown');
    await browser.waitForElementVisible('#videoscreen .pagination .paginDiscover', 5000, 'The load more button is shown');
    const videoEls = await browser.elements('css selector', '#videoscreen section.videogrid .videogrid__item');
    const numberOfVideoBeforeLoadMore = videoEls.value.length;
    await browser.moveToElement('.vr-headset__inner', 10 , 10);
    page.clickElement('@loadMoreBtn');
    await browser.waitForElementNotVisible('.preloader.load', 5000);
    browser.pause(5000);
    await browser.moveToElement('.vr-headset__inner', 10 , 10);
    browser.pause(5000);
    const videoAfterLoadMoreEls = await browser.elements('css selector', '#videoscreen section.videogrid .videogrid__item');
    const numberOfVideoAfterLoadMore = videoAfterLoadMoreEls.value.length;
    console.log(numberOfVideoBeforeLoadMore, numberOfVideoAfterLoadMore);
    browser.assert.ok(numberOfVideoBeforeLoadMore < numberOfVideoAfterLoadMore, 'Testing if number of video is greater after click load more button');
  },
};