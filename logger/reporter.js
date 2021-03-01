const _ = require('lodash');
const renderer = require('./renderer');
const open = require('opn');
const async = require('async');
const normalize = require('./normalize');
const logger = require('./logger');
const filenameHelpers = require('./outputFilename');
const fs = require('fs');

module.exports = function(options) {
  const opts = _.defaults({}, options, {
    reportsDirectory: __dirname + '/reports',
    logsDirectory: __dirname + '/logs',
    openBrowser: true,
    hideSuccess: false,
    reportFilename: 'report.html',
    reportLogfile: 'report.log',
    uniqueFilename: false,
    relativeScreenshots: false,
    themeName: 'default',
    logLevel: 1,
    debug: {
      saveNightwatch: false,
    },
  });

  if (!fs.existsSync(opts.reportsDirectory)) {
    fs.mkdir(opts.reportsDirectory, { recursive: true }, (err) => {
      if (err) console.log(err);
    });
  }

  if(!fs.existsSync(opts.logsDirectory)){
    fs.mkdir(opts.logsDirectory, { recursive: true }, (err) => {
      if (err) console.log(err);
    });
  }

 

  

  logger.setLevel(opts.logLevel);
  opts.fullOutputFilename = filenameHelpers.getOutputFilename(opts);
  opts.fullOutputLogfile = filenameHelpers.getOutputLogFile(opts);

  this.fn = function(results, done) {
    if (opts.separateReportPerSuite) {
      opts.fullOutputFilename = filenameHelpers.insertSuiteNameIntoFilename(
          opts.fullOutputFilename,
          _.last(Object.keys(results.modules))
      );

      opts.fullOutputLogfile = filenameHelpers.insertSuiteNameIntoLogFile(
          opts.fullOutputLogfile,
          _.last(Object.keys(results.modules))
      );
    }
    const generate = function generate(next) {
      async.waterfall([
        normalize.bind(this, opts, results),
        renderer.bind(this, opts),
      ], function(err, reportFilename, logOutputPath) {
        if (err) {
          logger.error('Error generating report: ' + err.toString());
          return next(err);
        }

        logger.info('HTML Report Generated at: ' + reportFilename);
        logger.info('Log Report Generated at: ' + logOutputPath);
        if (opts.openBrowser) {
          open(reportFilename);
        }

        next();
      });
    };

    async.series([
      function saveResults(next) {
        
        fs.writeFile(`${opts.logsDirectory}/originalResults.${Date.now()}.log`, JSON.stringify(results, null, '\t'), function(err) {
          next(err);
        });
      },
      generate,
    ], function(err) {
      done(err);
    });
  };
};
