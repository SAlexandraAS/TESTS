const constants = require('../constants');
const {commonCommand} = require('../utils');


module.exports = {
  url: `${constants.PROGRAM_PLAY_PAGE}${constants.PROGRAM_ID}/`,
  elements: {
    msgArea: '#msg',
    emojiBtn: '#emoji-button',
    sendBtn: '#enterShow',
    viewMoreBtn: '.viewMore .view-more',
  },
  commands: [{
    ...commonCommand,
  }],
};
