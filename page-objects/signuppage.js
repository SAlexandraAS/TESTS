const constants = require('../constants');
const {commonCommand} = require('../utils');

module.exports = {
  url: constants.SIGNUP_PAGE,
  elements: {
    emailInput: '#emailSignUp',
    usernameInput: '#name',
    passwordInput: '#password',
    confPasswordInput: '#password-confirm',
    maleInput: 'label.rbSexMale-label',
    femaleInput: 'label.rbSexFemale-label',
    dobInput: '#dobVisible',
    agreeSignupTerm: 'label.custom-control-label[for="cbSignUpTerms"]',
    signUpSubmitBtn: '#signUp',
    mbAcceptTerm: '#btnTermsAcceptMob'
  },
  commands: [{
    ...commonCommand,
    submit() {
      return this.click('@signUpSubmitBtn');
    },
  }],
};
