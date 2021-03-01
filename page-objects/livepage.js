const constants = require('../constants');
const {commonCommand} = require('../utils');


module.exports = {
  url: constants.LIVE_PAGE,
  elements: {
    headerSearchbar: '.programs .program--is-desktop .searchProgram',
    filterBtn: '.program__wrap #dropdownMenuButton',
    filterItem: '.program__wrap .filter__dropdown-menu a.filter__dropdown-item.dropdown-item-program:nth-of-type(2)',
    removefilterItem: '.program__wrap .filter__dropdown-menu a.filter__dropdown-item.dropdown-item-program:nth-of-type(1)',
    loadMoreBtn: '.program-all .pagination #live__pagin_next',
    changeTypeListBtn: '.program__wrap a.changeTypeList',
    toggleFilterMb: '.program__wrap .btn.showMobileFilter',
    headerSearchbarMb: '.mobileFilter .searchProgram',
    filterBtnMb: '.filter-mob__wrap .program__input--filter',
    filterItemMb: '.filter-mob__wrap .filter__dropdown-menu .dropdown-item-program:nth-of-type(2)',
    
  },
  commands: [{
    ...commonCommand,
    getDataValueOfFilterItem: async function(filterItem) {
      return await this.getAttribute(filterItem, 'data-status');
    },
  }],
};
