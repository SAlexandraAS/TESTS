const {randomString} = require('../../utils');
const constants = require('../../constants');

const setDefaultValueForFormExclde = (excludeField, page) => {
  const randomStr = randomString(8);
  const email = `t${randomStr}@mailinator.com`;
  excludeField !== 'email' && page.setInput('@emailInput', email);
  excludeField !== 'username' && page.setInput('@usernameInput', `${randomStr}`);
  excludeField !== 'pw' && page.setInput('@passwordInput', 'Admin@123');
  excludeField !== 'confPw' && page.setInput('@confPasswordInput', 'Admin@123');
  excludeField !== 'gender' && page.clickElement('@maleInput');
  excludeField !== 'dob' && page.setInput('@dobInput', '1993/11/21');
  
  return page;
};

module.exports = {
  'before': function(browser) {
    constants.CONFIG_APP.ENABLE_HTTP_AUTH && browser.url(constants.PASS_AUTH_BASE_URL);
  },
  'beforeEach': function(browser) {
    const page = browser.page.signuppage();
    page.navigate();
  },
  '@tags': ['UITestSignupPage'],
  'Signup is ok': async (browser) => {
    const page = browser.page.signuppage();
    await browser.waitForElementVisible('.signup-form');
    page.clickElement('@mbAcceptTerm');
    const randomStr = randomString(8);
    const email = `t${randomStr}@mailinator.com`;
    page.setInput('@emailInput', email);
    page.setInput('@usernameInput', `${randomStr}`);
    page.setInput('@passwordInput', 'Admin@123');
    page.setInput('@confPasswordInput', 'Admin@123');
    page.clickElement('@maleInput');
    page.setInput('@dobInput', '1993/11/21');
    page.submit();
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
  },
  'Signup with the empty mail or correct mail': async (browser) => {
    const page = browser.page.signuppage();
    await browser.waitForElementVisible('.signup-form');
    page.clickElement('@mbAcceptTerm');
    setDefaultValueForFormExclde('email', page).submit();
    const classListEmailIpt = await browser.getElementProperty('#emailSignUp', 'classList');
    browser.assert.ok(classListEmailIpt.value.includes('emptyField'), 'The input was highlighted');
    browser.assert.containsText('label#lableForemailSignUp', 'Empty', 'The input was highlighted with the message');
    browser.assert.not.urlContains('sign-up-welcome', 'The submit form has been not submitted');

    page.setInput('@emailInput', 'aaaaa');
    browser.assert.containsText('span.signUpFailed', 'Incorrect email format', 'The error message has been shown');
    page.submit();
    browser.assert.not.urlContains('sign-up-welcome', 'The submit form has been not submitted');
  },
  'Signup with the empty username': async (browser) => {
    const page = browser.page.signuppage();
    await browser.waitForElementVisible('.signup-form');
    page.clickElement('@mbAcceptTerm');
    setDefaultValueForFormExclde('username', page).submit();
    const classListEmailIpt = await browser.getElementProperty('#name', 'classList');
    browser.assert.ok(classListEmailIpt.value.includes('emptyField'), 'The input was highlighted');
    browser.assert.containsText('label#lableForname', 'Empty', 'The input was highlighted with the message');
    browser.assert.not.urlContains('sign-up-welcome', 'The submit form has been not submitted');

    page.setInput('@usernameInput', 'aaaaa');
    page.clearInput('@usernameInput'); // Workaround for trigger onChange event
    page.setInput('@usernameInput', 'aaaaa');
    browser.waitForElementVisible('span.signUpFailed', 5000);
    browser.assert.containsText('span.signUpFailed', 'Username must be at least 6 characters long', 'The error message has been shown');
    browser.pause(3000);
    page.submit();
    browser.assert.not.urlContains('sign-up-welcome', 'The submit form has been not submitted');
  },
  'Signup with the existed username': async (browser) => {
    const page = browser.page.signuppage();
    await browser.waitForElementVisible('.signup-form');
    page.clickElement('@mbAcceptTerm');
    setDefaultValueForFormExclde('username', page);
    page.setInput('@usernameInput', 'aaaaaaaaaa');
    page.clearInput('@usernameInput'); // Workaround for trigger onChange event

    page.setInput('@usernameInput', 'testuser');
    page.submit();
    browser.pause(2000);
    browser.waitForElementVisible('span.signUpFailed', 5000);
    browser.assert.containsText('span.signUpFailed', 'This username is already in use', 'The error message has been shown');

    browser.assert.not.urlContains('sign-up-welcome', 'The submit form has been not submitted');
  },
  'Click and hold to show the password': async (browser) => {
    const page = browser.page.signuppage();
    await browser.waitForElementVisible('.signup-form');
    page.clickElement('@mbAcceptTerm');
    page.setInput('@passwordInput', 'Admin@123');
    browser.waitForElementVisible('#lableForpassword + .pass-eye', 2000);
    const passwordEyeBtn = await browser.element('css selector', '#lableForpassword + .pass-eye');
    await browser.moveTo(Object.values(passwordEyeBtn.value)[0]);
    await browser.mouseButtonDown('#lableForpassword + .pass-eye');
    browser.pause(2000);
    const inputTypePw = await browser.getElementProperty('#password', 'type');
    browser.assert.ok(inputTypePw.value == 'text', 'The password has shown');
    await browser.mouseButtonUp('#lableForpassword + .pass-eye');
    const inputTypePw2 = await browser.getElementProperty('#password', 'type');
    browser.assert.ok(inputTypePw2.value == 'password', 'The password has hide');
  },
  'Signup with the empty password': async (browser) => {
    const page = browser.page.signuppage();
    await browser.waitForElementVisible('.signup-form');
    page.clickElement('@mbAcceptTerm');
    setDefaultValueForFormExclde('pw', page).submit();
    const classListEmailIpt = await browser.getElementProperty('#password', 'classList');
    browser.assert.ok(classListEmailIpt.value.includes('emptyField'), 'The input was highlighted');
    browser.assert.containsText('label#lableForpassword', 'Empty', 'The input was highlighted with the message');
    browser.assert.not.urlContains('sign-up-welcome', 'The submit form has been not submitted');

    page.setInput('@passwordInput', 'Admin');
    browser.assert.containsText('span.signUpFailed', 'Password should be minimum 6 symbols', 'The error message has been shown');
    page.submit();
    browser.assert.not.urlContains('sign-up-welcome', 'The submit form has been not submitted');
  },
  'Signup with the empty confirm password': async (browser) => {
    const page = browser.page.signuppage();
    await browser.waitForElementVisible('.signup-form');
    page.clickElement('@mbAcceptTerm');
    setDefaultValueForFormExclde('confPw', page).submit();
    const classListEmailIpt = await browser.getElementProperty('#password-confirm', 'classList');
    browser.assert.ok(classListEmailIpt.value.includes('emptyField'), 'The input was highlighted');
    browser.assert.containsText('label#lableForpassword-confirm', 'Empty', 'The input was highlighted with the message');
    browser.assert.not.urlContains('sign-up-welcome', 'The submit form has been not submitted');

    page.setInput('@confPasswordInput', 'Admin');
    browser.assert.containsText('span.signUpFailed', 'Passwords does not match', 'The error message has been shown');
    page.submit();
    browser.assert.not.urlContains('sign-up-welcome', 'The submit form has been not submitted');
  },
  'Signup with the empty gender': async (browser) => {
    const page = browser.page.signuppage();
    await browser.waitForElementVisible('.signup-form');
    page.clickElement('@mbAcceptTerm');
    setDefaultValueForFormExclde('gender', page);
    const classListEmailIpt = await browser.getElementProperty('.maleBlock', 'classList');
    browser.assert.ok(classListEmailIpt.value.includes('emptyField'), 'The input was highlighted');
    browser.assert.not.urlContains('sign-up-welcome', 'The submit form has been not submitsted');
  },
  'Signup with the empty dob': async (browser) => {
    const page = browser.page.signuppage();
    await browser.waitForElementVisible('.signup-form');
    page.clickElement('@mbAcceptTerm');
    setDefaultValueForFormExclde('dob', page).submit();
    const classListEmailIpt = await browser.getElementProperty('#dobVisible', 'classList');
    browser.assert.ok(classListEmailIpt.value.includes('emptyField'), 'The input was highlighted');
    browser.assert.not.urlContains('sign-up-welcome', 'The submit form has been not submitted');
  },
};
