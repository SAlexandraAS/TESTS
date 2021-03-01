const constants = require('../constants');
const {commonCommand} = require('../utils');

module.exports = {
  url: `${constants.LIVEDETAIL_PAGE}${constants.PROGRAM_ID}/`,
  elements: {},
  commands: [{
    ...commonCommand,
  }],
};
