const constants = require('../constants');
const {commonCommand} = require('../utils');

module.exports = {
  url: constants.HOME_PAGE,
  elements: {
    hamburgerBtn: '#headerMenuBurger',
    headerMenuBurgerBack: '#headerMenuBurgerBack',
    likedButton: '.likeContent',
    shareButton: '.sharesBtn',
    closeModalButton: '.swal2-popup .swal2-close',
    nextArtistSliderBtn: '.artists-list-wrapper.home_slider .home_slider-button--next',
    preArtistSliderBtn: '.artists-list-wrapper.home_slider .home_slider-button--prev',
    artistReadmoreLink: '.artists-more-link',
    getTheCeekVrHeadsetLink: '.vr-headset .vr-headset__inner .vr-headset__banner',
    getlinkAndroidApp: '.vr-headset .vr-headset__apps .vr-headset__link:first-of-type',
    getlinkIOSApp: '.vr-headset .vr-headset__apps .vr-headset__link:last-of-type',
    searchButton: '.header .js-header-open_search',
    searchInput: '.searchBlock  .search-bar .form-control.search-query',
    profileBtn: '.header-user-wrapper .header-user',
    upgradeAccBtn: '.new-sidebar #btnUser-buyCoins',
  },
  commands: [{
    ...commonCommand,
    isLogin: async function() {
      const ceekSess = await this.getCookie('ceek_sess');
      return !!ceekSess;
    },
    openSidebar() {
      return this.click('@hamburgerBtn');
    },
    closeSidebar() {
      return this.click('@headerMenuBurgerBack');
    },
    closeModal() {
      return this.click('@closeModalButton');
    },
  }],
};
