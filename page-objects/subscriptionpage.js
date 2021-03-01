const {commonCommand} = require('../utils');

module.exports = {
  elements: {
    buyVideoBtn: '#btnSubs-4',
    buyOneMonthBtn: '#btnSubs-1',
    buyThreeMonthBtn: '#btnSubs-2',
    stripeFormFirstName: '.stripeForm input[name="firstNameStripe"]',
    stripeFormLastName: '.stripeForm input[name="lastNameStripe"]',
    stripeFormCardNumber: '.stripeForm input[name="cardNumber"]',
    stripeFormCcExpiryDate: '.stripeForm input[name="ccExpiryDate"]',
    stripeFormCvvNumber: '.stripeForm input[name="cvvNumber"]',
    stripeFormSubmitBtn: '.stripeForm .payments-button',
  },
  commands: [{
    ...commonCommand,
    stripeFormSubmitBtnIsDisabled: async function() {
      const disabled = await this.getAttribute('@stripeFormSubmitBtn', 'disabled');

      return disabled.value;
    },
  }],
};