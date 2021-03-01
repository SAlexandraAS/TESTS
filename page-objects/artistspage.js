const constants = require('../constants');
const {commonCommand} = require('../utils');

module.exports = {
  url: constants.ARTIST_PAGE,
  elements: {
    filterCategoriesDropdown: '.singers-header-menu .singers-category #dropdownMenuButtonCategory .input__filter',
    filterCategoriesItem: '.singers-header-menu .singers-category .filter__dropdown-menu a[data-id="5ad7a6a69f41f6ee3786489c"]', // Music
    searchInput: '.singers-header-menu .singers-search input',
    sortDropdown: '.singers-header-menu .discover__filter-item #dropdownMenuButton button',
    sortItem: '.singers-header-menu .filter__dropdown-menu a[data-sortparameter="CeekPicks"]',
    changeTypeBtn: '.changeTypeList',
    loadMoreBtn: '.singers .pagination a.paginArtistSearch',
    searchInputMb: '.mobileFilter .searchArtist',
    filterCategoriesDropdownMb: '.mobileFilter .discover__input--filter',
    filterCategoriesItemMb: '.mobileFilter .filter__dropdown-menu a[data-id="5ad7a6a69f41f6ee3786489c"]',
    sortDropdownMb: '.mobileFilter #dropdownMenuButtonMobile',
    sortItemMb: '.mobileFilter .filter__dropdown-menu a[data-sortparameter="CeekPicks"]',
  },
  commands: [{
    ...commonCommand,
    getDataIdOfFilterItem: async function(filterItem) {
      return await this.getAttribute(filterItem, 'data-id');
    },
    getDataSortOfFilterItem: async function(sortItem) {
      return await this.getAttribute(sortItem, 'data-sortparameter');
    },
  }],
};
