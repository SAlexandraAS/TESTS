const constants = require('../constants');
const {commonCommand} = require('../utils');

module.exports = {
  url: `${constants.CHANNEL_PAGE}${constants.CHANNEL_ID}/`,
  elements: {
    backBtn: '.channels-inside .channels__header .btn--back', // ok
    channelDetailSearchBar: '.channels-inside .discover__filter .discover__wrap .searchOnPage',
    filterDropdown: '.channels-inside .discover__filter .discover__wrap .dropdown-toggle .input__filter',
    fillerDropdownTrendingItem: '.channels-inside .discover__wrap .filter__dropdown-menu .filter__dropdown-item[data-sortparameter="Trending"]',
    toggleFilterMb: '.discover__wrap .btn.showMobileFilter',
    channelDetailSearchBarMb: '.mobileFilter .searchOnPage',
    filterDropdownMb: '.mobileFilter .channelSort .dropdown-toggle .input__filter',
    fillerDropdownTrendingItemMb: '.mobileFilter .filter__dropdown-menu .filter__dropdown-item[data-sortparameter="Popular"]',
  },
  commands: [{
    ...commonCommand,
    getDataValueOfFilterItem: async function(filterItem) {
      return await this.getAttribute(filterItem, 'data-value');
    },
  }],
};
