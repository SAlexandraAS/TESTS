const constants = require('../constants');
const {commonCommand} = require('../utils');

module.exports = {
  url: constants.LOGIN_PAGE,
  elements: {
    usenameInput: '#si-email',
    passwordInput: '#si-password',
    forgotPwInput: '#emailForgot',
    submitButton: '#login',
    navigateToForgotPwBtn: '#btnForgotPass',
    submitForgotPwButton: '.mobFPassG1 button[type=submit].btn-main',
    btnBackInForgotpw: '.login-password .btnFPassBack',
  },
  commands: [{
    ...commonCommand,
    submitFormLogin() {
      return this.click('@submitButton');
    },
    isLogin: async function() {
      const loginCookie = await this.getCookie('ceek_sess');

      return !!loginCookie.value && loginCookie.name === 'ceek_sess';
    },
    logout: async function() {
      return await this.deleteCookies();
    },
  }],
};
