const constants = require('../constants');
const {commonCommand} = require('../utils');

module.exports = {
  url: constants.DISCOVER_PAGE,
  elements: {
    changeTypeListBtn: '.discover__wrap a.changeTypeList',
    loadMoreBtn: '.pagination',
  },
  commands: [{
    ...commonCommand,
  }],
};