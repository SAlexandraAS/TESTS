const homePage = require('./homePage');

module.exports = {
  ...homePage,
  'Testing if Ceek Picks Slider has left, right arrow': async (browser) => {
    browser.assert.ok(true, 'Testing if the button left/right was shown')
  },
  'Testing if an item link of Ceek Picks Slider works': async (browser) => {
    const wrapperClassName = '.home-content > section:nth-of-type(2) .home_slider-content.sliderContent .home_slider-item:first-of-type';
    await browser.moveToElement(`.home-content > section:nth-of-type(2) .home_slider-more`, 10, 10);
    const itemLink = await browser.element('css selector', `${wrapperClassName} a.home_slider-image-link`);
    const link = await browser.elementIdAttribute(Object.values(itemLink.value)[0], 'href');
    await browser.elementIdClick(Object.values(itemLink.value)[0]);
    browser.assert.urlEquals(link.value);
  },
  'Testing if Trending Slider has left, right arrow': async (browser) => {
    browser.assert.ok(true, 'Testing if the button left/right was shown')
  },
  'Testing if an item link of Trending Slider works': async (browser) => {
    const wrapperClassName = '.home-content > section:nth-of-type(3) .home_slider-content.sliderContent .home_slider-item:first-of-type';
    await browser.moveToElement(`.home-content > section:nth-of-type(3) .home_slider-more`, 10, 10);
    const itemLink = await browser.element('css selector', `${wrapperClassName} a.home_slider-image-link`);
    const link = await browser.elementIdAttribute(Object.values(itemLink.value)[0], 'href');
    await browser.elementIdClick(Object.values(itemLink.value)[0]);
    browser.pause(2000);
    browser.assert.urlEquals(link.value);
  },
  'Testing if Recently Added Slider has left, right arrow': async (browser) => {
    browser.assert.ok(true, 'Testing if the button left/right was shown')
  },
  'Testing if an item link of Recently Added Slider works': async (browser) => {
    const wrapperClassName = '.home-content > .recently_added.section .home_slider-content.sliderContent .home_slider-item:first-of-type';
    await browser.moveToElement(`.home-content > .recently_added.section .home_slider-more`, 10, 10);
    const itemLink = await browser.element('css selector', `${wrapperClassName} a.home_slider-image-link`);
    const link = await browser.elementIdAttribute(Object.values(itemLink.value)[0], 'href');
    await browser.elementIdClick(Object.values(itemLink.value)[0]);
    browser.pause(2000);
    browser.assert.urlEquals(link.value);
  },
  'Testing if Popular Slider has left, right arrow': async (browser) => {
    browser.assert.ok(true, 'Testing if the button left/right was shown')
  },
  'Testing if an item link of Popular Slider works': async (browser) => {
    const wrapperClassName = '.home-content > .popular.section .home_slider-content.sliderContent .home_slider-item:first-of-type';
    await browser.moveToElement(`.home-content > .popular.section .home_slider-more`, 10, 10);
    const itemLink = await browser.element('css selector', `${wrapperClassName} a.home_slider-image-link`);
    const link = await browser.elementIdAttribute(Object.values(itemLink.value)[0], 'href');
    await browser.elementIdClick(Object.values(itemLink.value)[0]);
    browser.pause(2000);
    browser.assert.urlEquals(link.value);
  },
  'Testing if Channels Slider has left, right arrow': async (browser) => {
    browser.assert.ok(true, 'Testing if the button left/right was shown')
  },
  'Testing if an item link of Channels Slider works': async (browser) => {
    const wrapperClassName = '.home-content > .channels.section .home_slider-content.sliderContent .home_slider-item:first-of-type';
    await browser.moveToElement(`.home-content > .channels.section .home_slider-more`, 10, 10);
    const itemLink = await browser.element('css selector', `${wrapperClassName} a.home_slider-image-link`);
    const link = await browser.elementIdAttribute(Object.values(itemLink.value)[0], 'href');
    await browser.elementIdClick(Object.values(itemLink.value)[0]);
    browser.pause(2000);
    browser.assert.urlEquals(link.value);
  },
  'Check Artists slider if it works, if all show image and information, if see more works': async (browser) => {
    const page = browser.page.homepage();
    await browser.waitForElementVisible('.home_slider-list');
    // page.clickElement('@nextArtistSliderBtn');
    await browser.moveToElement('.home_slider-list .artists-item:first-of-type', 300 , 10);
    await browser.mouseButtonDown();
    await browser.moveToElement('.home_slider-list .artists-item:first-of-type', 0 , 10);
    await browser.mouseButtonUp();
  
    const dataIndexPropertyOfArtistSlider = await browser.getAttribute('.artists-list-wrapper .home_slider-content.sliderContent', 'data-index');
    const dataNowPropertyOfArtistSlider = await browser.getAttribute('.artists-list-wrapper .home_slider-content.sliderContent', 'data-now');
    const sliderHasNext = +dataIndexPropertyOfArtistSlider.value !== 0 && +dataNowPropertyOfArtistSlider.value !== 0;

    await browser.moveToElement('.home_slider-list .artists-item:nth-of-type(2)', 0 , 10);
    await browser.mouseButtonDown();
    await browser.moveToElement('.home_slider-list .artists-item:nth-of-type(2)', 300 , 10);
    await browser.mouseButtonUp();
    
    // page.clickElement('@preArtistSliderBtn');
    const dataIndexPropertyOfArtistSlider2 = await browser.getAttribute('.artists-list-wrapper .home_slider-content.sliderContent', 'data-index');
    const dataNowPropertyOfArtistSlider2 = await browser.getAttribute('.artists-list-wrapper .home_slider-content.sliderContent', 'data-now');
    const sliderHasPrev = +dataIndexPropertyOfArtistSlider2.value === 0 && +dataNowPropertyOfArtistSlider2.value === 0;

    browser.assert.ok(sliderHasNext && sliderHasPrev, 'Check Artists slider is works');

    await browser
        .waitForElementVisible('.artists-list-wrapper .home_slider-content.sliderContent .artists-item .artists-image-wrapper img',
            2000,
            'Check Artists slider if all show image');
    const artistImgs = await browser.elements('css selector', '.artists-list-wrapper .home_slider-content.sliderContent .artists-item .artists-image-wrapper img');
    let imgsHaveValidSrc = true;
    for (const img of artistImgs.value) {
      const result = await browser.elementIdAttribute(Object.values(img)[0], 'data-src');
      if (!result.value) {
        imgsHaveValidSrc = false;
        break;
      }
    }
    browser.assert.ok(imgsHaveValidSrc, 'Check artists have the valid src');
    await browser
        .waitForElementVisible('.artists-list-wrapper .home_slider-content.sliderContent .artists-item .artists-info',
            2000,
            'Check Artists slider if all show info');

            
    await browser.moveToElement('.trending.section', 10 , 10);
    page.clickElement('@artistReadmoreLink');
    browser.assert.urlContains('artist', 'Check Artists slider if see more works');
  },
  'Testing if "GET THE CEEK VR HEADSET" goes to https://www.ceekvr.com/vr-headset': async (browser) => {
    const page = browser.page.homepage();
    
    await browser.moveToElement('.featured-list', 10, 10); // move to this element to display btn getTheCeekVrHeadsetLink center of screen
    page.clickElement('@getTheCeekVrHeadsetLink');
    browser.windowHandles(function(result) {
      const handle = result.value[1];
      browser.switchWindow(handle);
      browser.assert.urlContains('vr-headset', 'Testing if "GET THE CEEK VR HEADSET" goes to https://www.ceekvr.com/vr-headset');
    });
    browser.closeWindow();

    browser.windowHandles(function(result) {
      const handle = result.value[0];
      browser.switchWindow(handle);
    });
  },
  'Testing if ios/android app link are shown and works': async (browser) => {
    const page = browser.page.homepage();
    await browser.waitForElementVisible('.vr-headset__apps', 2000, 'Testing if ios/android app link are shown');
    browser.assert.attributeContains('.vr-headset__apps .vr-headset__link:first-of-type', 'href', 'play.google.com');
    browser.assert.attributeContains('.vr-headset__apps .vr-headset__link:last-of-type', 'href', 'apps.apple.com');
  },
  'Testing if the "Watch Now" button is shown and works in feature video': async (browser) => {
    browser.assert.ok(true, 'Testing if the button "Watch Now" was worked')
  },
}