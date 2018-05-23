

const path = require('path');
const gulp = require('gulp');
const conf = require('./conf');

const $ = require('gulp-load-plugins')();

const wiredep = require('wiredep').stream;
const _ = require('lodash');

const browserSync = require('browser-sync');

gulp.task('inject-reload', ['inject'], () => {
  browserSync.reload();
});

gulp.task('inject', ['scripts'], () => {
  const injectStyles = gulp.src([
    path.join(conf.paths.src, '/app/**/*.css'),
    path.join(conf.paths.src, '/assets/**/*.css'),
    path.join(conf.paths.src, '/app/css/fonts/**/css/*.css')
  ], { read: false });

  const injectScripts = gulp.src([
    path.join(conf.paths.src, '/app/**/*.module.js'),
    path.join(conf.paths.src, '/app/**/*.js'),
    path.join(conf.paths.src, '/app/js/**/*.js'),
    path.join(`!${conf.paths.src}`, '/app/**/*.spec.js'),
    path.join(`!${conf.paths.src}`, '/app/**/*.mock.js'),
  ])
    .pipe($.angularFilesort()).on('error', conf.errorHandler('AngularFilesort'));
  console.log(path.join(conf.paths.src, '/app/**/*.module.js'));
  console.log(path.join(conf.paths.src, '/app/**/*.js'));

  const injectOptions = {
    ignorePath: [conf.paths.src, path.join(conf.paths.tmp, '/serve')],
    addRootSlash: true
  };

  return gulp.src(path.join(conf.paths.src, '/*.html'))
    .pipe($.inject(injectStyles, injectOptions))
    .pipe($.inject(injectScripts, injectOptions))
    .pipe(wiredep(_.extend({}, conf.wiredep)))
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve')));
});
