const usernameHttpBasicAuth = 'test.ceek.com';
const passwordHttpBasicAuth = 'test.ceek.com';

const PASS_AUTH_BASE_URL = `https://${usernameHttpBasicAuth}:${passwordHttpBasicAuth}@test.ceek.com/`;
const BASE_URL = 'https://test.ceek.com/';

module.exports = Object.freeze({
  PASS_AUTH_BASE_URL: PASS_AUTH_BASE_URL,
  BASE_URL: BASE_URL,
  HOME_PAGE: BASE_URL,
  LOGIN_PAGE: `${BASE_URL}login/`,
  SIGNUP_PAGE: `${BASE_URL}signup/`,
  CHANNEL_PAGE: `${BASE_URL}channel/`,
  ARTIST_PAGE: `${BASE_URL}artist/`,
  RESET_PAGE: `${BASE_URL}ressetpassword/`,
  FILTER_CHANNELS: `${BASE_URL}filter-channels/`,
  FILTER_CHANNEL: `${BASE_URL}filter-channel/`,
  FILTER_PROGRAMS: `${BASE_URL}programs/`,
  ARTIST_CHANNEL: `${BASE_URL}artist-filter/`,
  VIDEO_PAGE: `${BASE_URL}video/`,
  PROGRAM_PLAY_PAGE: `${BASE_URL}program-play/`,
  PROGRAM_PREVIEW_PAGE: `${BASE_URL}preview-play/`,
  DISCOVER_PAGE: `${BASE_URL}discover/`,
  LIVE_PAGE: `${BASE_URL}live/`,
  LIVEDETAIL_PAGE: `${BASE_URL}program/`,
  CONFIG_APP: {
    ENABLE_HTTP_AUTH: true,
  },
  CORRECT_ACC: {
    username: 'test@ceek.com',
    password: '12345678',
  },
  PAYPAL_ACC: {
    email: 'sb-om9rj4181207@personal.example.com',
    password: 'p^:8-Q1u',
  },
  CHANNEL_ID: 16,
  PREMIUM_VIDEO_ID: 572,
  PREMIUM_VIDEO_ID2: 574,
  PROGRAM_ID: '5fe57f44e9793202de45087e',
});
