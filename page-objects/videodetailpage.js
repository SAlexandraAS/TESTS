const constants = require('../constants');
const {commonCommand} = require('../utils');


module.exports = {
  url: `${constants.VIDEO_PAGE}${constants.PREMIUM_VIDEO_ID}/`,
  elements: {
    playBtn: '.home-inside .btnPlay',
    playPreviewBtn: '.home-inside #previewBtn',
    addListBtn: '.home-inside .btnMyList',
    backBtn: '.home-inside .btn-backHome',
    loginBtn: '#login',
    buyVideoBtn: '#btnSubs-4',
    stripeFormFirstName: '.stripeForm input[name="firstNameStripe"]',
    stripeFormLastName: '.stripeForm input[name="lastNameStripe"]',
    stripeFormCardNumber: '.stripeForm input[name="cardNumber"]',
    stripeFormCcExpiryDate: '.stripeForm input[name="ccExpiryDate"]',
    stripeFormCvvNumber: '.stripeForm input[name="cvvNumber"]',
    stripeFormSubmitBtn: '.stripeForm .payments-button',
  },
  commands: [{
    ...commonCommand,
  }],
};