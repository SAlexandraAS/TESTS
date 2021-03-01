const constants = require('../../constants');
const commonTestCase = require('../shared/liveDetailPage');

module.exports = {
  'before': function(browser) {
    constants.CONFIG_APP.ENABLE_HTTP_AUTH && browser.url(constants.PASS_AUTH_BASE_URL);
  },
  'beforeEach': function(browser) {
    const page = browser.page.livedetailpage();
    page.navigate();
  },
  '@tags': ['UITestLiveDetailpage'],
  ...commonTestCase,
  'Check if love shown and works in NO AUTH': async (browser) => {
    browser.assert.visible('.hero-info__stats .heroVideoLike');
    await browser.click('.hero-info__stats .heroVideoLike');
    await browser.waitForElementVisible('.swal2-popup.swal2-modal.swal2-show');
    const titleOfModalLogin = await browser.getText('.swal2-popup.swal2-modal.swal2-show .swal2-title');
    browser.assert.equal(titleOfModalLogin.value, 'Please log in to continue', 'Testing if love function require login');
  },
  'Check if it requires login when click Add to my list': async (browser) => {
    browser.waitForElementVisible('#btnContainer');
    await browser.click('#btnContainer .btn--my-list-add');
    await browser.waitForElementVisible('.swal2-popup.swal2-modal.swal2-show');
    const titleOfModalLogin = await browser.getText('.swal2-popup.swal2-modal.swal2-show .swal2-title');
    browser.assert.equal(titleOfModalLogin.value, 'Please log in to continue', 'Testing if add to my list function require login');
  },
  'Check if it redirected to the program page after logged': async (browser) => {
    browser.waitForElementVisible('#btnContainer');
    await browser.click('#btnContainer .btn--my-list-add');
    await browser.waitForElementVisible('.swal2-popup.swal2-modal.swal2-show');
    const titleOfModalLogin = await browser.getText('.swal2-popup.swal2-modal.swal2-show .swal2-title');
    browser.assert.equal(titleOfModalLogin.value, 'Please log in to continue', 'Testing if add to my list function require login');
    await browser.click('.swal2-popup.swal2-modal.swal2-show .swal2-actions .swal2-confirm');
    browser.pause(3000);
    const loginpage = browser.page.loginpage();
    loginpage.navigate();
    loginpage.setInput('@usenameInput', constants.CORRECT_ACC.username);
    loginpage.setInput('@passwordInput', constants.CORRECT_ACC.password);
    loginpage.submitFormLogin();
    browser.pause(3000);
    browser.assert.urlContains(`program/${constants.PROGRAM_ID}`);
  },
}
;
