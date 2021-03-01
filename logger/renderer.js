var fs = require('fs'),
    pug = require('pug'),
    path = require('path'),
    logger = require('./logger');

module.exports = function(opts, testRun, callback) {
  var theme = opts.customTheme
  ? path.join(process.cwd(), opts.customTheme)
  : path.join(__dirname, 'themes', opts.themeName, 'index.pug');
  var outputPath = opts.fullOutputFilename;

  var logTemplate = path.join(__dirname, 'themes', 'log.pug');
  var logOutputPath = opts.fullOutputLogfile;

  var log = null;
  var html = null;
  try {
    html = pug.renderFile(theme, {
      pretty: true,
      hideSuccess: opts.hideSuccess,
      testRun: testRun
    });

    log = pug.renderFile(logTemplate, {
      pretty: true,
      hideSuccess: opts.hideSuccess,
      testRun: testRun
    });
  } catch (e) {
    return callback(e.toString());
  }

  logger.log('Saving Report File');
  fs.writeFile(outputPath, html, function(err) {
    if(err) {
      callback(err, outputPath, logOutputPath, html, testRun);
    } else {
      fs.writeFile(logOutputPath, log, function(error) {
        callback(error, outputPath, logOutputPath, html, testRun);
      });
    }
    
  });

  


  

  return outputPath;
};
