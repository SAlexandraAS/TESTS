const constants = require('../../constants');
const videoDetailPageTestCase = require('../shared/videoDetailPage');

const videoDetailUrl = `${constants.VIDEO_PAGE}${constants.PREMIUM_VIDEO_ID}/`;
module.exports = {
  'before': async (browser) => {
    constants.CONFIG_APP.ENABLE_HTTP_AUTH && browser.url(constants.PASS_AUTH_BASE_URL);
  },
  'beforeEach': function(browser) {
    browser.url(videoDetailUrl);
  },
  '@tags': ['UITestVideoDetailPage'],
  ...videoDetailPageTestCase,
  'Check Play pop up login/signup when it\'s clicked': async (browser) => {
    const page = browser.page.videodetailpage();
    browser.waitForElementVisible('.home-inside');
    page.clickElement('@playBtn');
    await browser.waitForElementVisible('.swal2-popup.swal2-modal.swal2-show');
    const titleOfModalLogin = await browser.getText('.swal2-popup.swal2-modal.swal2-show .swal2-title');
    browser.assert.equal(titleOfModalLogin.value, 'Please log in to continue', 'Testing if click "Play" button, pop up login/signup will show');
  },
  'Check Add To My List pop up login/signup when it\'s clicked': async (browser) => {
    const page = browser.page.videodetailpage();
    browser.waitForElementVisible('.home-inside');
    page.clickElement('@addListBtn');
    await browser.waitForElementVisible('.swal2-popup.swal2-modal.swal2-show');
    const titleOfModalLogin = await browser.getText('.swal2-popup.swal2-modal.swal2-show .swal2-title');
    browser.assert.equal(titleOfModalLogin.value, 'Please log in to continue', 'Testing if click "Add to my list" button, pop up login/signup will show');
  },
  'Check Login/Sign up goes to the correct pages': async (browser) => {
    const page = browser.page.videodetailpage();
    browser.waitForElementVisible('.home-inside');
    page.clickElement('@addListBtn');
    await browser.waitForElementVisible('.swal2-popup.swal2-modal.swal2-show');
    const titleOfModalLogin = await browser.getText('.swal2-popup.swal2-modal.swal2-show .swal2-title');
    browser.assert.equal(titleOfModalLogin.value, 'Please log in to continue', 'Testing if click "Add to my list" button, pop up login/signup will show');

    await browser.click('.swal2-popup.swal2-modal.swal2-show .swal2-actions .swal2-confirm');
    browser.pause(3000);

    const loginpage = browser.page.loginpage();
    loginpage.navigate();
    loginpage.setInput('@usenameInput', constants.CORRECT_ACC.username);
    loginpage.setInput('@passwordInput', constants.CORRECT_ACC.password);
    loginpage.submitFormLogin();
    browser.pause(3000);
    browser.assert.urlEquals(videoDetailUrl);
  },
};
