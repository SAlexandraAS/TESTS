
const constants = require('../../constants');
const {randomString} = require('../../utils');

let email = '';
let pw = '';
module.exports = {
  'before': async (browser) => {
    constants.CONFIG_APP.ENABLE_HTTP_AUTH && browser.url(constants.PASS_AUTH_BASE_URL);

    const signuppage = browser.page.signuppage();
    signuppage.navigate();
    signuppage.clickElement('@mbAcceptTerm');
    await browser.waitForElementVisible('.signup-form');
    const randomStr = randomString(8);
    email = `t${randomStr}@mailinator.com`;
    pw = 'Admin@123';
    signuppage.setInput('@emailInput', email);
    signuppage.setInput('@usernameInput', `${randomStr}`);
    signuppage.setInput('@passwordInput', pw);
    signuppage.setInput('@confPasswordInput', pw);
    signuppage.clickElement('@maleInput');
    signuppage.setInput('@dobInput', '1993/11/21');
    signuppage.submit();
    browser.pause(5000);
    const target = email.replace('@mailinator.com', '');
    browser.url(`https://www.mailinator.com/v3/index.jsp?zone=public&query=${target}#/#inboxpane`);
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

    const loginPage = browser.page.loginpage();
    loginPage.navigate();
    loginPage.setInput('@usenameInput', email);
    loginPage.setInput('@passwordInput', pw);
    console.log('LOGIN with user: ', email, '- passwoord: ', pw);
    loginPage.submitFormLogin();
  },
  '@tags': ['UITestSubscription'],
  'Check single video purchase': async (browser) => {
    const videodetailpage = browser.page.videodetailpage();
    await browser.url(`${constants.VIDEO_PAGE}${constants.PREMIUM_VIDEO_ID}/`);
    videodetailpage.clickElement('@playBtn');
    browser.assert.not.urlContains('play/', 'User have to buy this video to see');
    browser.pause(2000);
    const subscriptionpage = browser.page.subscriptionpage();
    subscriptionpage.clickElement('@buyVideoBtn');
    subscriptionpage.setInput('@stripeFormFirstName', 'John');
    subscriptionpage.setInput('@stripeFormLastName', 'Doe');
    subscriptionpage.setInput('@stripeFormCardNumber', '4242 4242 4242 4242 ');
    subscriptionpage.setInput('@stripeFormCcExpiryDate', '03/21');
    subscriptionpage.setInput('@stripeFormCvvNumber', '123');
    subscriptionpage.clickElement('@stripeFormSubmitBtn');
    // Test multi time clicks
    subscriptionpage.clickElement('@stripeFormSubmitBtn');
    subscriptionpage.clickElement('@stripeFormSubmitBtn');
    const stripeFormSubmitBtnIsDisabled = await subscriptionpage.stripeFormSubmitBtnIsDisabled();
    browser.assert.ok(stripeFormSubmitBtnIsDisabled, 'Can click button checkout once');
    browser.pause(5000);
    videodetailpage.navigate();
    videodetailpage.clickElement('@playBtn');
    browser.assert.urlContains('play/', 'User can see the video now');
  },
  'Check if perchase happen multiple times and email sent by Stripe': async (browser) => {
    const homepage = browser.page.homepage();
    homepage.navigate();
    homepage.clickElement('@profileBtn');
    browser.waitForElementVisible('.new-sidebar');
    const coniEl = await browser.getText('.user-sidebar-menu .user-points');
    const coinNumbersBeforeUpgrade = +coniEl.value.trim().match(/\d/g).join('');
    homepage.clickElement('@upgradeAccBtn');
    browser.pause(2000);
    browser.assert.urlContains('#buy-coins');


    const subscriptionpage = browser.page.subscriptionpage();

    subscriptionpage.clickElement('@buyOneMonthBtn'); // Buy 100 coins
    subscriptionpage.setInput('@stripeFormFirstName', 'John');
    subscriptionpage.setInput('@stripeFormLastName', 'Doe');
    subscriptionpage.setInput('@stripeFormCardNumber', '4242 4242 4242 4242 ');
    subscriptionpage.setInput('@stripeFormCcExpiryDate', '03/21');
    subscriptionpage.setInput('@stripeFormCvvNumber', '123');
    subscriptionpage.clickElement('@stripeFormSubmitBtn');
    browser.pause(5000);
    homepage.navigate();
    homepage.clickElement('@profileBtn');
    browser.waitForElementVisible('.new-sidebar');
    const coniElAfterBuyCoin = await browser.getText('.user-sidebar-menu .user-points');
    const coinNumbersAfterBuyCoin = +coniElAfterBuyCoin.value.trim().match(/\d/g).join('');

    browser.assert.ok(coinNumbersBeforeUpgrade === coinNumbersAfterBuyCoin - 100, 'User bought coin once time');
    const target = email.replace('@mailinator.com', '');
    browser.url(`https://www.mailinator.com/v3/index.jsp?zone=public&query=${target}#/#inboxpane`);
    browser.waitForElementVisible('#inboxpane .x_content a:first-of-type');
    browser.click('#inboxpane .x_content a:first-of-type');
    browser.waitForElementVisible('#msg_body'); // wait for the content to be ready
    browser.frame('msg_body'); // switch to the message content's iframe
    browser.pause(1000);
    const thankYouText = await browser.getText('body');
    const nextBillingDateStr = thankYouText.value.trim().match(/\d{1,2}\/\d{1,2}\/\d{4}/g).join('');

    const nextBillingDate = new Date(nextBillingDateStr); // dd-mm-YYYY
    const today = new Date();

    browser.assert.ok(nextBillingDate > today, 'Testing if next billing date if greater than today');
  },
  'Check subscription purchase by Paypal': async (browser) => {
    const homepage = browser.page.homepage();
    homepage.navigate();
    homepage.clickElement('@profileBtn');
    browser.waitForElementVisible('.new-sidebar');
    const coniEl = await browser.getText('.user-sidebar-menu .user-points');
    const coinNumbersBeforeUpgrade = +coniEl.value.trim().match(/\d/g).join('');
    console.log('===coinNumbersBeforeUpgrade==>', coinNumbersBeforeUpgrade);
    homepage.clickElement('@upgradeAccBtn');
    browser.pause(2000);
    browser.assert.urlContains('#buy-coins');
    const subscriptionpage = browser.page.subscriptionpage();
    subscriptionpage.clickElement('@buyThreeMonthBtn');

    await browser.waitForElementVisible('.swal2-popup.swal2-modal.swal2-show');
    const titleOfModalLogin = await browser.getText('.swal2-popup.swal2-modal.swal2-show .swal2-title');
    browser.assert.equal(titleOfModalLogin.value, 'Are you sure you want to cancel subscription?', 'Testing if the cancel subscription modal shown');
    await browser.click('.swal2-popup.swal2-modal.swal2-show .swal2-actions .swal2-confirm-long');
    subscriptionpage.clickElement('@buyOneMonthBtn');
    await browser.moveToElement('.payments-footer', 10, 400)
    const paypalBtnID = await browser.getElementProperty('iframe.component-frame', 'id');
    browser.waitForElementVisible(`#${paypalBtnID.value}`);
    browser.frame(paypalBtnID.value);
    browser.waitForElementVisible(`.paypal-button`);
    await browser.click('.paypal-button');
    browser.windowHandles(async function(result) { // In Paypal
      const handle = result.value[1];
      browser.switchWindow(handle);
      browser.pause(10000);
      browser.setValue('input#email', constants.PAYPAL_ACC.email);
      await browser.click('button#btnNext');
      browser.pause(5000);
      browser.setValue('input#password', constants.PAYPAL_ACC.password);
      await browser.click('button#btnLogin');
      browser.pause(6000);
      await browser.click('#acceptAllButton');
      await browser.click('#button button.confirmButton');
      browser.pause(5000);
      await browser.click('#confirmButtonTop');
    });
    browser.pause(5000);

    browser.windowHandles(async function(result) {
      const handle = result.value[0];
      browser.switchWindow(handle);
      browser.pause(10000);

      homepage.navigate();
      await browser.waitForElementNotVisible('.preloader.load', 5000);
      homepage.clickElement('@profileBtn');
      browser.waitForElementVisible('.new-sidebar');
      // Wait point update
      const coniElAfterBuyCoin = await browser.getText('.user-sidebar-menu .user-points');
      const coinNumbersAfterBuyCoin = +coniElAfterBuyCoin.value.trim().match(/\d/g).join('');
      console.log('===coinNumbersAfterBuyCoin==>', coinNumbersAfterBuyCoin);
      browser.assert.ok(coinNumbersBeforeUpgrade === coinNumbersAfterBuyCoin - 100, 'Testing if user bought the correct point package');
    });
  },


};

