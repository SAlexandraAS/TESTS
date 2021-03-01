const constants = require('../constants');
const {commonCommand} = require('../utils');

module.exports = {
  url: constants.CHANNEL_PAGE,
  elements: {
    filterBtn: '#dropdownMenuButtonCategory',
    filterItem: '.singers-header-menu .filter__dropdown-menu a.filter__dropdown-item.channelsFilterItem:nth-of-type(2)',
    headerSearchbar: '.channels__form .singers-search input',
    changeTypeListBtn: '.singers-header-menu a.changeTypeList',
    backBtn: '.channels-inside .channels__header .btn--back',
    channelDetailSearchBar: '.channels-inside .discover__filter .discover__wrap .searchOnPage',
    filterDropdown: '.channels-inside .discover__filter .discover__wrap .dropdown-toggle .input__filter',
    fillerDropdownTrendingItem: '.channels-inside .discover__wrap .filter__dropdown-menu .filter__dropdown-item[data-sortparameter="Trending"]',
    loadMoreBtn: '.channels .pagination a.paginChannels',
    toggleFilterMb: '.singers-header-menu .btn.showMobileFilter',
    headerSearchbarMb: '.mobileFilter .search-query-channel',
    filterBtnMb: '.filter.filter-mob__item button.input__filter.discover__input--filter',
    filterItemMb: '.mobileFilter .filter__dropdown-menu .filter__dropdown-item.channelsFilterItem[data-target="popular"]'
  },
  commands: [{
    ...commonCommand,
    getDataValueOfFilterItem: async function(filterItem) {
      return await this.getAttribute(filterItem, 'data-value');
    },
  }],
};