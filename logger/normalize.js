const _ = require('lodash');
const TestRun = require('./models/testRun');
const getRelativePath = require('./relativePath');

function getScreenshotPaths(sysout) {
  const re = /\[\[ATTACHMENT\|([^\]]*)\]\]/g;
  const result = []; let matches = [];

  while (matches = re.exec(sysout[0])) {
    result.push(matches[1]);
  }

  return result;
}

function concatErrMessages(concatTo, errs) {
  return _.uniq(concatTo.concat(_.map(errs, _.trim)));
}

function parse(str) {
  return _.isNaN(str) ? 0 : parseInt(str, 10);
}

const normalizers = {
  // Converts an object given to us by nightwatch
  // into models.
  latest: function(results, run, options, done) {
    run.errmessages = concatErrMessages(run.errmessages, results.errmessages);
    _.forOwn(results.modules, function(pkg, pkgName) {
      const npkg = {
        name: pkgName,
        suites: [],
        tests: pkg.tests,
        failures: pkg.failures,
        errors: pkg.errors,
        isFailure: (pkg.failures !== 0 && pkg.errors !== 0),
      };

      _.forOwn(pkg.completed, function(suite, suiteName) {
        
        
        const nsuite = {
          name: suiteName,
          pkgName: npkg.name,
          passed: suite.passed,
          failures: suite.failed,
          errors: suite.errors,
          skipped: suite.skipped,
          time: suite.time,
          cases: [],
        };

        // Little weird here but the report object
        // will not report an error, it will instead
        // have X failed and empty assertions array.
        if (nsuite.failures > 0 && suite.assertions.length === 0) {
          nsuite.errors = nsuite.failures;
        }

        nsuite.isFailure = nsuite.failures !== 0 || nsuite.errors !== 0;
        npkg.suites.push(nsuite);

        _.each(suite.assertions, function(assertion) {
          const assert = _.clone(assertion, true);
          const [stackTrace,] = suite.stackTrace.split('\n    at');
          assert.stackTrace = stackTrace.trim();
          assert.screenshots = assert.screenshots || [];
          assert.isFailure = assertion.failure;
          nsuite.cases.push(assert);

          if (options.relativeScreenshots) {
            assert.screenshots = assert.screenshots.map(function(sspath) {
              return getRelativePath(options.fullOutputFilename, sspath);
            });
          }

          if (assert.isFailure) {
            nsuite.isFailure = true;
          }
        });

        if (nsuite.isFailure) {
          npkg.isFailure = true;
        }
      });

      run.addPackage(npkg);

      if (npkg.isFailure) {
        run.isFailure = npkg.isFailure;
      }
    });
    done(null, run);
  },

};

module.exports = function(options, data, callback) {
  const opts = _.defaults({}, options, {hideSuccess: false});
  const testRun = new TestRun(opts);
  return normalizers['latest'](data, testRun, opts, callback);
};
