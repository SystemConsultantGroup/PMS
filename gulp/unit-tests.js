

const path = require('path');
const gulp = require('gulp');
const conf = require('./conf');

const karma = require('karma');

const pathSrcHtml = [
  path.join(conf.paths.src, '/**/*.html')
];

const pathSrcJs = [
  path.join(conf.paths.src, '/**/!(*.spec).js')
];

function runTests(singleRun, done) {
  const reporters = ['progress'];
  const preprocessors = {};

  pathSrcHtml.forEach((path) => {
    preprocessors[path] = ['ng-html2js'];
  });

  if (singleRun) {
    pathSrcJs.forEach((path) => {
      preprocessors[path] = ['coverage'];
    });
    reporters.push('coverage');
  }

  const localConfig = {
    configFile: path.join(__dirname, '/../karma.conf.js'),
    singleRun,
    autoWatch: !singleRun,
    reporters,
    preprocessors
  };

  const server = new karma.Server(localConfig, ((failCount) => {
    done(failCount ? new Error(`Failed ${failCount} tests.`) : null);
  }));
  server.start();
}

gulp.task('test', ['scripts'], (done) => {
  runTests(true, done);
});

gulp.task('test:auto', ['watch'], (done) => {
  runTests(false, done);
});
