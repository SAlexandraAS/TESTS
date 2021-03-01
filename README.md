# Usage

### Default browser: Google Chrome
- To run with Firefox please add ```-- -c nightwatch.firefox.conf.js``` \
For example:

```bash
    npm run test:all -- -c nightwatch.firefox.conf.js
```
- To run mobile ui please add ```-- --env=mobile``` \
For example:

```bash
    npm run test:all -- --env=mobile
```

1, For running all test cases:
```bash
    npm run test:all
```
2, For running test cases of the LOGIN page:
```bash
    npm run test:UITestLoginPage
```
3, For running test cases of the SIGNUP page:
```bash
    npm run test:UITestSignupPage
```
4, For running test cases of the HOME page:
```bash
    npm run test:UITestHomepage
```
5, For running test cases of the HOME page has AUTHENTICATED:
```bash
    npm run test:UITestHomepageInAuthenticate
```
6, For running test cases of the CHANNEL LIST page:
```bash
    npm run test:UITestChannelPage
```
7, For running test cases of the CHANNEL LIST page has AUTHENTICATED:
```bash
    npm run test:UITestChannelPageInAuth
```
8, For running test cases of the CHANNEL DETAIL page:
```bash
    npm run test:UITestChannelDetailPage
```
9, For running test cases of the CHANNEL DETAIL page has AUTHENTICATED:
```bash
    npm run test:UITestChannelDetailPageInAuth
```
10, For running test cases of the ARTIST LIST page:
```bash
    npm run test:UITestArtistPage
```
11, For running test cases of the ARTIST LIST page has AUTHENTICATED:
```bash
    npm run test:UITestArtistPageInAuth
```
12, For running test cases of the ARTIST DETAIL page:
```bash
    npm run test:UITestArtistDetailPage
```
13, For running test cases of the ARTIST DETAIL page has AUTHENTICATED:
```bash
    npm run test:UITestArtistDetailPageInAuth
```
14, For running test cases of the VIDEO DETAIL page:
```bash
    npm run test:UITestVideoDetailPage
```
15, For running test cases of the VIDEO DETAIL page has AUTHENTICATED:
```bash
    npm run test:UITestVideoDetailPageInAuth
```
16, For running test cases of the SUBSCRIPTION page:
```bash
    npm run test:UITestSubscription
```
17, For running test cases of the DISCOVERY page:
```bash
    npm run test:UITestDiscoverypage
```
18, For running test cases of the DISCOVERY page has AUTHENTICATED::
```bash
    npm run test:UITestDiscoverypage
```
19, For running test cases of the LIVE page:
```bash
    npm run test:UITestLivepage
```
20, For running test cases of the LIVE DETAIL page:
```bash
    npm run test:UITestLiveDetailpage
```
21, For running test cases of the LIVE DETAIL page has AUTHENTICATED:
```bash
    npm run test:UITestLiveDetailpageInAuth
```
22, For running test cases of the PROGRAM PLAYER page:
```bash
    npm run test:UITestProgramPlayPageInAuth
```



# Logger

After run the tese case, you can check the log in folder `reports/` 

```javascript
    const reporter = new HtmlReporter({
        openBrowser: false,
        reportsDirectory: __dirname + '/reports/html',
        logsDirectory: __dirname + '/reports/logs',
        uniqueFilename: true,
    });
```
You can update the configuration in file `nightwatch.conf.js`
## Options
```javascript
    {
        /* String. Relative path to custom theme. When this is given, `themeName` will be ignored. */
        customTheme: 'relative/path/to/theme.pug',

        /* Boolean. If true, then only errors will be shown in the report. */
        hideSuccess: false,
        
        /* Boolean. If true, the generated html will be opened in your browser after the test run. */
        openBrowser: true,

            /* Boolean. If true, we convert screenshot paths from absolute paths 
            to relative to output file. */
        relativeScreenshots: false
        
        /* String. The directory you've set nightwatch to store your reports. */
        reportsDirectory: __dirname + '/reports',

        /* String. The filename that the html report will be saved as. */
        reportFilename: 'generatedReport.html',
        
        /* Boolean. If true, we append the last suite name to the report filename. */
        separateReportPerSuite: false,	
        
        /* String. The theme that will be used to generate the html report.
            This should match a directory under the lib/themes directory. */
        themeName: 'default',
        
        /* Boolean. If true, we ensure the generated report filename
            is unique by appending a timestamp to the end. */
        uniqueFilename: false,
    }
```