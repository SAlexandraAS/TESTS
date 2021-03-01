const {renderMsgForWaitElement} = require('../../utils');

module.exports = {
  'Testing if top promotion banner was shown.': async (browser) => {
    await browser.waitForElementNotVisible('.preloader.load', 5000, renderMsgForWaitElement(true));
    browser.assert.elementPresent('.advertising.bannerItem:not(.hidden)', 'Testing if the top promotion banner was showing.');
  },
  'Testing if top menu bar items are shown.': async (browser) => {
    await browser.waitForElementVisible('.nav-list');
    const navListItems = await browser.elements('css selector', '.nav-list li.nav-item .nav-text');
    
    browser.assert.ok(navListItems.value.length > 0, 'Testing if top menu bar items were shown.');
    let navItemTxtIsEmpty = false;
    for (const item of navListItems.value) {
      const result = await browser.elementIdText(Object.values(item)[0]);
      if (!result.value) {
        navItemTxtIsEmpty = true;
        break;
      }
    }
    browser.assert.ok(!navItemTxtIsEmpty, 'Testing if top menu bar items were not empty.');
  },
  'Testing if sidebar menu is working.': async (browser) => {
    const page = browser.page.homepage();
    await browser.waitForElementVisible('#headerMenuBurger', 5000, 'Testing if button open sidebar menu was shown.');
    page.openSidebar();
    const classListOfHeaderMenuWrapper = await browser.getElementProperty('.header-menu-wrapper', 'classList');
    const headerMenuWrapperHasClassActive = classListOfHeaderMenuWrapper.value.includes('active');

    const cssDisplayHeaderMenu = await browser.getCssProperty('.menu.header-menu', 'display');
    const headerMenuIsVisible = cssDisplayHeaderMenu.value === 'flex';

    browser.assert.ok(headerMenuWrapperHasClassActive && headerMenuIsVisible, 'Testing if sidebar menu was working.');
  },
  'Testing if featured videos are shown': async (browser) => {
    await browser.waitForElementVisible('.hero', 5000, 'Testing if the hero banner was shown.');
    const srcHeroImage = await browser.getAttribute('.hero-image.heroImage', 'src');
    browser.assert.ok(srcHeroImage.value.length, 'Testing the featured video section was shown.');
  },
  'Testing if the "Watch Now" button is shown and works in feature video': async (browser) => {
    await browser.waitForElementVisible('.hero .hero-button.watchMore', 5000, 'Testing if the button "Watch Now" was shown');
    const typeBtn = await browser.getAttribute('.hero .hero-button.watchMore', 'data-type');
    await browser.click('.hero .hero-button.watchMore');
    
    browser.assert.urlContains(typeBtn.value == 'live' ? 'program' : typeBtn.value, 'Testing if the button "Watch Now" was worked');
  },
  'Testing if Ceek Picks Slider has left, right arrow': async (browser) => {
    const wrapperClassName = '.home-content > section:nth-of-type(2)';
    const sliderBtnClassName = `${wrapperClassName} .trending-button.home_slider-button`;
    await browser.waitForElementVisible(sliderBtnClassName, 5000, 'Testing if the button left/right was shown');
    await browser.click(`${sliderBtnClassName}.sliderNext`);
    browser.pause(2000);
    const slider = await browser.element('css selector', `${wrapperClassName} .home_slider-content.sliderContent`);
    const dataIndex = await browser.elementIdAttribute(Object.values(slider.value)[0], 'data-index');
    browser.assert.ok(dataIndex.value == 1, 'Testing the slider has been moved after click next');
    await browser.click(`${sliderBtnClassName}.sliderPrev`);
    browser.pause(2000);
    const slider2 = await browser.element('css selector', `${wrapperClassName} .home_slider-content.sliderContent`);
    const dataIndex2 = await browser.elementIdAttribute(Object.values(slider2.value)[0], 'data-index');
    browser.assert.ok(dataIndex2.value == 0, 'Testing the slider has been moved after click back');
  },
  'Testing if an item link of Ceek Picks Slider works': async (browser) => {
    const wrapperClassName = '.home-content > section:nth-of-type(2) .home_slider-content.sliderContent .home_slider-item:first-of-type';
    const itemLink = await browser.element('css selector', `${wrapperClassName} a.home_slider-image-link`);
    const link = await browser.elementIdAttribute(Object.values(itemLink.value)[0], 'href');
    await browser.elementIdClick(Object.values(itemLink.value)[0]);
    browser.assert.urlEquals(link.value);
  },
  'Testing if Trending Slider has left, right arrow': async (browser) => {
    const wrapperClassName = '.home-content > section:nth-of-type(3) ';
    const sliderBtnClassName = `${wrapperClassName} .trending-button.home_slider-button`;
    await browser.waitForElementVisible(sliderBtnClassName, 5000, 'Testing if the button left/right was shown');
    await browser.click(`${sliderBtnClassName}.sliderNext`);
    browser.pause(2000);
    const slider = await browser.element('css selector', `${wrapperClassName} .home_slider-content.sliderContent`);
    const dataIndex = await browser.elementIdAttribute(Object.values(slider.value)[0], 'data-index');
    browser.assert.ok(dataIndex.value == 1, 'Testing the slider has been moved after click next');
    await browser.click(`${sliderBtnClassName}.sliderPrev`);
    browser.pause(2000);
    const slider2 = await browser.element('css selector', `${wrapperClassName} .home_slider-content.sliderContent`);
    const dataIndex2 = await browser.elementIdAttribute(Object.values(slider2.value)[0], 'data-index');
    browser.assert.ok(dataIndex2.value == 0, 'Testing the slider has been moved after click back');
  },
  'Testing if an item link of Trending Slider works': async (browser) => {
    const wrapperClassName = '.home-content > section:nth-of-type(3) .home_slider-content.sliderContent .home_slider-item:first-of-type';
    const itemLink = await browser.element('css selector', `${wrapperClassName} a.home_slider-image-link`);
    const link = await browser.elementIdAttribute(Object.values(itemLink.value)[0], 'href');
    await browser.elementIdClick(Object.values(itemLink.value)[0]);
    browser.pause(2000);
    browser.assert.urlEquals(link.value);
  },
  'Testing if Recently Added Slider has left, right arrow': async (browser) => {
    const wrapperClassName = '.home-content > .recently_added.section';
    const sliderBtnClassName = `${wrapperClassName} .recently_added-button.home_slider-button`;
    await browser.waitForElementVisible(sliderBtnClassName, 5000, 'Testing if the button left/right was shown');
    await browser.click(`${sliderBtnClassName}.sliderNext`);
    browser.pause(2000);
    const slider = await browser.element('css selector', `${wrapperClassName} .home_slider-content.sliderContent`);
    const dataIndex = await browser.elementIdAttribute(Object.values(slider.value)[0], 'data-index');
    browser.assert.ok(dataIndex.value == 1, 'Testing the slider has been moved after click next');
    await browser.click(`${sliderBtnClassName}.sliderPrev`);
    browser.pause(2000);
    const slider2 = await browser.element('css selector', `${wrapperClassName} .home_slider-content.sliderContent`);
    const dataIndex2 = await browser.elementIdAttribute(Object.values(slider2.value)[0], 'data-index');
    browser.assert.ok(dataIndex2.value == 0, 'Testing the slider has been moved after click back');
  },
  'Testing if an item link of Recently Added Slider works': async (browser) => {
    const wrapperClassName = '.home-content > .recently_added.section .home_slider-content.sliderContent .home_slider-item:first-of-type';
    const itemLink = await browser.element('css selector', `${wrapperClassName} a.home_slider-image-link`);
    const link = await browser.elementIdAttribute(Object.values(itemLink.value)[0], 'href');
    await browser.elementIdClick(Object.values(itemLink.value)[0]);
    browser.pause(2000);
    browser.assert.urlEquals(link.value);
  },
  'Testing if Popular Slider has left, right arrow': async (browser) => {
    const wrapperClassName = '.home-content > .popular.section';
    const sliderBtnClassName = `${wrapperClassName} .popular-button.home_slider-button`;
    await browser.waitForElementVisible(sliderBtnClassName, 5000, 'Testing if the button left/right was shown');
    await browser.click(`${sliderBtnClassName}.sliderNext`);
    browser.pause(2000);
    const slider = await browser.element('css selector', `${wrapperClassName} .home_slider-content.sliderContent`);
    const dataIndex = await browser.elementIdAttribute(Object.values(slider.value)[0], 'data-index');
    browser.assert.ok(dataIndex.value == 1, 'Testing the slider has been moved after click next');
    await browser.click(`${sliderBtnClassName}.sliderPrev`);
    browser.pause(2000);
    const slider2 = await browser.element('css selector', `${wrapperClassName} .home_slider-content.sliderContent`);
    const dataIndex2 = await browser.elementIdAttribute(Object.values(slider2.value)[0], 'data-index');
    browser.assert.ok(dataIndex2.value == 0, 'Testing the slider has been moved after click back');
  },
  'Testing if an item link of Popular Slider works': async (browser) => {
    const wrapperClassName = '.home-content > .popular.section .home_slider-content.sliderContent .home_slider-item:first-of-type';
    const itemLink = await browser.element('css selector', `${wrapperClassName} a.home_slider-image-link`);
    const link = await browser.elementIdAttribute(Object.values(itemLink.value)[0], 'href');
    await browser.elementIdClick(Object.values(itemLink.value)[0]);
    browser.pause(2000);
    browser.assert.urlEquals(link.value);
  },
  'Testing if Channels Slider has left, right arrow': async (browser) => {
    const wrapperClassName = '.home-content > .channels.section';
    const sliderBtnClassName = `${wrapperClassName} .channels-button.home_slider-button`;
    await browser.waitForElementVisible(sliderBtnClassName, 5000, 'Testing if the button left/right was shown');
    await browser.click(`${sliderBtnClassName}.sliderNext`);
    browser.pause(2000);
    const slider = await browser.element('css selector', `${wrapperClassName} .home_slider-content.sliderContent`);
    const dataIndex = await browser.elementIdAttribute(Object.values(slider.value)[0], 'data-index');
    browser.assert.ok(dataIndex.value == 1, 'Testing the slider has been moved after click next');
    await browser.click(`${sliderBtnClassName}.sliderPrev`);
    browser.pause(2000);
    const slider2 = await browser.element('css selector', `${wrapperClassName} .home_slider-content.sliderContent`);
    const dataIndex2 = await browser.elementIdAttribute(Object.values(slider2.value)[0], 'data-index');
    browser.assert.ok(dataIndex2.value == 0, 'Testing the slider has been moved after click back');
  },
  'Testing if an item link of Channels Slider works': async (browser) => {
    const wrapperClassName = '.home-content > .channels.section .home_slider-content.sliderContent .home_slider-item:first-of-type';
    const itemLink = await browser.element('css selector', `${wrapperClassName} a.home_slider-image-link`);
    const link = await browser.elementIdAttribute(Object.values(itemLink.value)[0], 'href');
    await browser.elementIdClick(Object.values(itemLink.value)[0]);
    browser.pause(2000);
    browser.assert.urlEquals(link.value);
  },
  'Testing if all items are shown in sidebar and if back button works': async (browser) => {
    const page = browser.page.homepage();
    page.openSidebar();
    await browser.waitForElementVisible('.header-menu-list', 5000, 'Testing if the menu list in header was shown.');
    const sidebarItems = await browser.elements('css selector', '.header-menu-list .header-menu-item:not(.only-mobile) .header-menu-link');
    browser.assert.ok(sidebarItems.value.length > 0, 'Testing if all items were shown in sidebar.');
    let sidebarItemTxtIsEmpty = false;
    for (const item of sidebarItems.value) {
      const result = await browser.elementIdText(Object.values(item)[0]);
      if (!result.value) {
        sidebarItemTxtIsEmpty = true;
        break;
      }
    }
    browser.assert.ok(!sidebarItemTxtIsEmpty, 'Testing if all items in sidebar were not empty.');

    page.closeSidebar();
    const classListOfHeaderMenuWrapperAfterClose = await browser.getElementProperty('.header-menu-wrapper', 'classList');
    const headerMenuWrapperNotHasClassActive = !classListOfHeaderMenuWrapperAfterClose.value.includes('active');

    const cssDisplayHeaderMenuAfterClose = await browser.getCssProperty('.menu.header-menu', 'display');
    const headerMenuIsNotVisible = cssDisplayHeaderMenuAfterClose.value === 'none';
    browser.assert.ok(headerMenuWrapperNotHasClassActive && headerMenuIsNotVisible, 'Testing if the back button works');
  },
  'Testing if share button show and work': async (browser) => {
    await browser.waitForElementVisible('.home.mainPage .hero-inner .sharesBtn', 5000, 'Testing if the share button in hero banner was visible');
    await browser.click('.home.mainPage .hero-inner .sharesBtn');
    await browser.waitForElementVisible('.share-button_dropdown.share-button-opened', 5000, 'Testing if the sharing modal was opened' );
    const itemShares = await browser.elements('css selector', '.share-button_dropdown .share-button_dropdown-link');
    browser.assert.ok(itemShares.value.length, 'Testing if the share button work when no login');
  },
  'Testing if artist name and video title was shown': async (browser) => {
    await browser.waitForElementVisible('.artists.section', 5000, renderMsgForWaitElement());
    const artistItemsInSlider = await browser.elements('css selector', '.artists.section .artists-list-wrapper .home_slider-content .artists-item');
    const artistNameItemsInSlider = await browser.elements('css selector', '.artists.section .artists-list-wrapper .home_slider-content .artists-item .artists-info .artists-title');

    let artistNameIsEmpty = false;
    for (const item of artistNameItemsInSlider.value) {
      const result = await browser.elementIdAttribute(Object.values(item)[0], 'outerText');
      if (result.value) {
        artistNameIsEmpty = true;
      }
    }

    browser.assert.ok(
      artistItemsInSlider.value.length &&
      artistNameItemsInSlider.value.length &&
      artistItemsInSlider.value.length === artistNameItemsInSlider.value.length &&
      artistNameIsEmpty, 
      'Testing if the artist name is not empty');

    await browser.waitForElementVisible('.trending.section', 5000, renderMsgForWaitElement());
    const videoItemInTrendingSlider =
      await browser.elements('css selector', '.trending.section .trending-list-wrapper .home_slider-content .home_slider-item');
    const videoTitleInItemInTrendingSlider =
      await browser.elements('css selector', '.trending.section .trending-list-wrapper .home_slider-content .home_slider-item .home_slider-name');

    let titleInTrendingSliderIsEmpty = false;
    for (const item of videoTitleInItemInTrendingSlider.value) {
      const result = await browser.elementIdAttribute(Object.values(item)[0], 'outerText');
      if (result.value) {
        titleInTrendingSliderIsEmpty = true;
      }
    }
    
    const allVideoInTrendingSectionHasTitle = videoItemInTrendingSlider.value.length &&
      videoTitleInItemInTrendingSlider.value.length &&
      videoItemInTrendingSlider.value.length === videoTitleInItemInTrendingSlider.value.length &&
      titleInTrendingSliderIsEmpty;

    browser.assert.ok(allVideoInTrendingSectionHasTitle, 'Testing if video title in TRENDING SECTION was shown');

    await browser.waitForElementVisible('.recently_added.section');
    const videoItemInRecentlySlider = await browser.elements('css selector', '.recently_added.section .recently_added-list-wrapper .home_slider-content .home_slider-item');
    const videoTitleInItemInRecentlySlider = await browser.elements('css selector', '.recently_added.section .recently_added-list-wrapper .home_slider-content .home_slider-item .home_slider-name');
    const allVideoInRecentlySectionHasTitle = videoItemInRecentlySlider.value.length && videoTitleInItemInRecentlySlider.value.length && videoItemInRecentlySlider.value.length === videoTitleInItemInRecentlySlider.value.length;

    await browser.waitForElementVisible('.popular.section');
    const videoItemInPopularSlider = await browser.elements('css selector', '.popular.section .popular-list-wrapper .home_slider-content .home_slider-item');
    const videoTitleInItemInPopularSlider = await browser.elements('css selector', '.popular.section .popular-list-wrapper .home_slider-content .home_slider-item .home_slider-name');
    const allVideoInPopularSectionHasTitle = videoItemInPopularSlider.value.length && videoTitleInItemInPopularSlider.value.length && videoItemInPopularSlider.value.length === videoTitleInItemInPopularSlider.value.length;

    
    browser.assert.ok(allVideoInRecentlySectionHasTitle, 'Testing if video title in RECENTLY SECTION was shown');
    browser.assert.ok(allVideoInPopularSectionHasTitle, 'Testing if video title in POPULAR was shown');

    

    let titleInRecentlySliderIsEmpty = false;
    for (const item of videoTitleInItemInRecentlySlider.value) {
      const result = await browser.elementIdAttribute(Object.values(item)[0], 'outerText');
      if (!result.value) {
        titleInRecentlySliderIsEmpty = true;
        break;
      }
    }
    browser.assert.ok(!titleInRecentlySliderIsEmpty, 'Testing if title in Recently section is not empty');

    let titleInPopularSliderIsEmpty = false;
    for (const item of videoTitleInItemInPopularSlider.value) {
      const result = await browser.elementIdAttribute(Object.values(item)[0], 'outerText');
      if (!result.value) {
        titleInPopularSliderIsEmpty = true;
        break;
      }
    }
    browser.assert.ok(!titleInPopularSliderIsEmpty, 'Testing if title in Popular section is not empty');
  },
  'Check Artists slider if it works, if all show image and information, if see more works': async (browser) => {
    const page = browser.page.homepage();
    await browser.waitForElementVisible('.artists-button.home_slider-button .artists-button-icon');
    page.clickElement('@nextArtistSliderBtn');
    const dataIndexPropertyOfArtistSlider = await browser.getAttribute('.artists-list-wrapper .home_slider-content.sliderContent', 'data-index');
    const dataNowPropertyOfArtistSlider = await browser.getAttribute('.artists-list-wrapper .home_slider-content.sliderContent', 'data-now');

    const sliderHasNext = +dataIndexPropertyOfArtistSlider.value !== 0 && +dataNowPropertyOfArtistSlider.value !== 0;
    page.clickElement('@preArtistSliderBtn');
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

    page.clickElement('@artistReadmoreLink');
    browser.assert.urlContains('artist', 'Check Artists slider if see more works');
  },
  'Testing if footer and menus are shown and work': async (browser) => {
    await browser.waitForElementVisible('.footer', 5000, 'Testing if footer are shown');
    await browser.waitForElementVisible('.footer .footer__nav', 5000, 'Testing if the menu if footer  are shown');
    const footerNavItems = await browser.elements('css selector', '.footer .footer__nav .footer__nav-group');
    browser.assert.ok(!!footerNavItems.value.length, 'Check the menu in footer have items');
  },
  'Testing if "GET THE CEEK VR HEADSET" goes to https://www.ceekvr.com/vr-headset': async (browser) => {
    const page = browser.page.homepage();
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
    page.clickElement('@getlinkAndroidApp');
    browser.windowHandles(function(result) {
      const handle = result.value[1];
      browser.switchWindow(handle);
      browser.assert.urlContains('play.google.com', 'Testing if android app link works');
    });
    browser.closeWindow();

    browser.windowHandles(function(result) {
      const handle = result.value[0];
      browser.switchWindow(handle);
    });

    page.clickElement('@getlinkIOSApp');
    browser.windowHandles(function(result) {
      const handle = result.value[1];
      browser.switchWindow(handle);
      browser.assert.urlContains('apps.apple.com', 'Testing if ios app link works');
    });
    browser.closeWindow();

    browser.windowHandles(function(result) {
      const handle = result.value[0];
      browser.switchWindow(handle);
    });
  },
  'Testing if search works in menu bar. Test keyword is "search"': async (browser) => {
    const page = browser.page.homepage();
    page.clickElement('@searchButton');
    await browser.waitForElementVisible('.search.searchBlock.active', 2000, '[11] Check search modal was shown');
    page.setInput('@searchInput', 'test');
    await browser.waitForElementVisible('.search-area .search-results.searchResults .screens.active');
    const resultArticleItems = await browser.elements('css selector', '.search-area .search-results.searchResults .screens.active #screen-search article');
    browser.assert.ok(!!resultArticleItems.value.length, '[11] Testing if search works in menu bar. Test keyword is "test" has results');
    page.clearInput('@searchInput');
    page.setInput('@searchInput', 'search');
    await browser.waitForElementVisible('.search-area .search-results.searchResults .no-results.active', 2000, 'Testing if search works in menu bar. Test keyword is "search" has no results');
  },
  'Testing if license footer': async (browser) => {
    await browser.waitForElementVisible('.footer .footer__basement', 5000, 'Testing if license footer was shown');
    const socialBtns = await browser.elements('css selector', '.footer .footer__basement .footer__socials .footer__socials-link');
    let allSocialBtnHasLink = false;
    const socialLinkMustshow = [
      'www.facebook.com',
      'twitter.com',
      'www.instagram.com',
      'www.youtube.com',
    ];
    let isValidUrl = false;
    for(const socialBtn of  socialBtns.value) {
      const link = await browser.elementIdAttribute(Object.values(socialBtn)[0], 'href');
      if(link.value) {
        allSocialBtnHasLink = true;
        const urlObj = new URL(link.value);
        if(socialLinkMustshow.includes(urlObj.host)) 
          isValidUrl = true;
      }
    }
    browser.assert.ok(allSocialBtnHasLink, 'Testing if all social button works')
    browser.assert.ok(isValidUrl, 'Testing if all social button has valid link')
  }
};