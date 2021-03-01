const {randomString} = require('../../utils');
const constants = require('../../constants');

module.exports = {
  'before': function(browser) { 
    constants.CONFIG_APP.ENABLE_HTTP_AUTH && browser.url(constants.PASS_AUTH_BASE_URL);
  },
  'beforeEach': function(browser) {
    const page = browser.page.loginpage();
    page.navigate();
    page.clearInput('@usenameInput');
    page.clearInput('@passwordInput');
  },
  '@tags': ['UITestLoginPage'],
  'Login with the incorrect username': async (browser) => {
    const page = browser.page.loginpage();
    await browser.waitForElementVisible('.signin-form', 2000);
    page.setInput('@usenameInput', 'test@ceekkk.com');
    page.setInput('@passwordInput', '12345678');
    page.submitFormLogin();

    browser.assert
        .containsText('.signin-form .signInFailed strong',
            'Email or Username not found',
            'Login with the incorrect username and the corrent password should be Fail');
  },
  'Login with the incorrect password': async (browser) => {
    const page = browser.page.loginpage();
    page.setInput('@usenameInput', 'test@ceek.com');
    page.setInput('@passwordInput', '1234567899999');
    page.submitFormLogin();

    browser.assert
        .containsText('.signin-form .signInFailed strong',
            'Incorrect Email or Password combination',
            'Login with the correct username and the incorrect password should be Fail');
  },
  'Login with the corrent account': async (browser) => {
    const page = browser.page.loginpage();
    page.setInput('@usenameInput', constants.CORRECT_ACC.username);
    page.setInput('@passwordInput', constants.CORRECT_ACC.password);
    page.submitFormLogin();

    const isLogin = await page.isLogin();
    browser.assert.ok(isLogin, 'Login with the correct username and password should be OK');
    page.logout();
  },
  'Login with empty Email or Password': async (browser) => {
    const page = browser.page.loginpage();
    page.setInput('@passwordInput', '12345678');
    page.submitFormLogin();
    const classListEmailIpt = await browser.getElementProperty('#si-email', 'classList');
    browser.assert.ok(classListEmailIpt.value.includes('emptyField'), 'The input was highlighted when email is empty');
    browser.assert.containsText('label#label-si-email', 'Field is empty!', 'The input was highlighted with the message');
    browser.assert.urlContains('login', 'The submit form has been not submitted');

    page.clearInput('@passwordInput');
    page.setInput('@usenameInput', 'test@cddddeek.com');
    page.submitFormLogin();
    const classListPwIpt = await browser.getElementProperty('#si-password', 'classList');
    browser.assert.ok(classListPwIpt.value.includes('emptyField'), 'The input was highlighted when password is empty');
    browser.assert.containsText('label#label-si-password', 'Field is empty!', 'The input was highlighted with the message');
    browser.assert.urlContains('login', 'The submit form has been not submitted');
  },
  'Can go to forgot password page': async (browser) => {
    const page = browser.page.loginpage();
    page.clickElement('@navigateToForgotPwBtn');
    browser.assert.cssProperty('div.login-password[data-tab="forgot-password"]', 'display', 'block', 'Forgot password tab displayed');
    browser.assert.cssProperty('div.signin-form[data-tab="sign-in"]', 'display', 'none', 'Sign in tab hided');
    page.clickElement('@btnBackInForgotpw');
    browser.assert.cssProperty('div.login-password[data-tab="forgot-password"]', 'display', 'block', 'Forgot password hided again');
    browser.assert.cssProperty('div.signin-form[data-tab="sign-in"]', 'display', 'none', 'Sign in has been backed');
  },
  'Can go to forgot password page and submit with empty input': async (browser) => {
    const page = browser.page.loginpage();
    page.clickElement('@navigateToForgotPwBtn');
    browser.assert.cssProperty('div.login-password[data-tab="forgot-password"]', 'display', 'block', 'Forgot password tab displayed');
    browser.assert.cssProperty('div.signin-form[data-tab="sign-in"]', 'display', 'none', 'Sign in tab hided');
    const inputEmailForgotHasRequired = await browser.getAttribute('#emailForgot', 'required');
    browser.assert.ok(inputEmailForgotHasRequired.value, 'The input was required');
    page.setInput('@forgotPwInput', `${randomString(8)}@mail.com`);
    page.clickElement('@submitForgotPwButton');
    browser.waitForElementVisible('.login-password .invalid-feedback.is-invalid', 5000, 'The error message has shown');
    browser.assert.containsText('.login-password .invalid-feedback.is-invalid strong', 'Not Found Email', 'The message has shown correctly');
  },
  'Send email forgot password success': async (browser) => {
    const signuppage = browser.page.signuppage();
    signuppage.navigate();
    await browser.waitForElementVisible('.signup-form');
    signuppage.clickElement('@mbAcceptTerm');
    const randomStr = randomString(8);
    const email = `t${randomStr}@mailinator.com`;
    console.log('EMAIL: ', email);
    signuppage.setInput('@emailInput', email);
    signuppage.setInput('@usernameInput', `${randomStr}`);
    signuppage.setInput('@passwordInput', 'Admin@123');
    signuppage.setInput('@confPasswordInput', 'Admin@123');
    signuppage.clickElement('@maleInput');
    signuppage.setInput('@dobInput', '1993/11/21');
    signuppage.submit();
    browser.pause(5000);
    const target = email.replace('@mailinator.com', '');
    browser.url(`https://www.mailinator.com/v3/index.jsp?zone=public&query=${target}#/#inboxpane`);
    browser.waitForElementVisible('#inboxpane', 5000, 'Load the inbox of the mailinator');
    browser.waitForElementVisible('#inboxpane .x_content a:first-of-type');
    browser.click('.cc-btn.cc-dismiss');
    browser.click('#inboxpane .x_content a:first-of-type');
    browser.waitForElementVisible('#msg_body'); // wait for the content to be ready
    browser.frame('msg_body'); // switch to the message content's iframe
    browser.pause(1000);
    const linkInEmail = await browser.getAttribute('a[target="_other"]:nth-of-type(2)', 'href');
    browser.url(linkInEmail.value);
    browser.assert.urlContains('login', 'Check the link in email redirect to login page');
    browser.waitForElementVisible('.swal2-popup.swal2-show', 2000);
    browser.assert.containsText('.swal2-popup.swal2-show #swal2-title', 'Your Registration is confirmed. Please login', 'The confirmation is success');
    browser.pause(2000);
    browser.click('.swal2-popup .swal2-actions .swal2-confirm');
    const page = browser.page.loginpage();
    page.clickElement('@navigateToForgotPwBtn');
    browser.pause(3000);
    browser.assert.cssProperty('div.login-password[data-tab="forgot-password"]', 'display', 'block', 'Forgot password tab displayed');
    browser.assert.cssProperty('div.signin-form[data-tab="sign-in"]', 'display', 'none', 'Sign in tab hided');
    page.setInput('@forgotPwInput', email);
    page.clickElement('@submitForgotPwButton');
    browser.pause(2000);
    browser.assert.urlContains('login', 'The email has been existed in system');
    browser.assert.containsText('.swal2-popup.swal2-show #swal2-title', 'Please check your inbox', 'The email has been sent');
    browser.pause(5000); // Wait to send mail
    browser.url(`https://www.mailinator.com/v3/index.jsp?zone=public&query=${target}#/#inboxpane`);
    browser.waitForElementVisible('#inboxpane', 5000, 'Load the inbox of the mailinator');
    browser.waitForElementVisible('#inboxpane .x_content a:first-of-type');
    browser.click('#inboxpane .x_content .colormob0 a:first-of-type');
    browser.waitForElementVisible('#msg_body'); // wait for the content to be ready
    browser.frame('msg_body'); // switch to the message content's iframe
    browser.pause(1000);
    browser.click('a[target="_other"]:first-of-type');
    browser.windowHandles(function(result) {
      const handle = result.value[1];
      browser.switchWindow(handle);
      browser.assert.urlContains('ressetpassword', 'The link in email is correctly');
    });
    browser.closeWindow();

    browser.windowHandles(function(result) {
      const handle = result.value[0];
      browser.switchWindow(handle);
    });
  },
};
