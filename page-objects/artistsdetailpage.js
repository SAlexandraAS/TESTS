const constants = require('../constants');
const {commonCommand} = require('../utils');

module.exports = {
  url: constants.ARTIST_PAGE,
  elements: {
    backButton: '.singer.singerInfo .singer-inner button.btn--back',
  },
  commands: [{
    ...commonCommand,

  }],
};
