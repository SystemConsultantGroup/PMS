

const path = require('path');
const gulp = require('gulp');
const conf = require('./conf');

const browserSync = require('browser-sync');

const $ = require('gulp-load-plugins')();

const wiredep = require('wiredep').stream;
const _ = require('lodash');

gulp.task('styles-reload', ['styles'], () => buildStyles()
  .pipe(browserSync.stream()));

gulp.task('styles', () => buildStyles());

var buildStyles = function () {
  const lessOptions = {
    options: [
      'bower_components',
      path.join(conf.paths.src, '/app')
    ]
  };

  // var injectFiles = gulp.src([
  //   path.join(conf.paths.src, '/app/**/*.less'),
  //   path.join('!' + conf.paths.src, '/app/index.less')
  // ], { read: false });

  const injectFiles = gulp.src([
    path.join(conf.paths.src, '/app/**/*.css'),
    path.join(`!${conf.paths.src}`, '/app/index.css')
  ], {
    read: false
  });


  const injectOptions = {
    transform(filePath) {
      filePath = filePath.replace(`${conf.paths.src}/app/`, '');
      return `@import "${filePath}";`;
    },
    starttag: '// injector',
    endtag: '// endinjector',
    addRootSlash: false
  };


  return gulp.src([
    // path.join(conf.paths.src, '/app/index.less')
    path.join(conf.paths.src, '/app/index.css')
  ])
    .pipe($.inject(injectFiles, injectOptions))
    .pipe(wiredep(_.extend({}, conf.wiredep)))
    .pipe($.sourcemaps.init())
    .pipe($.less(lessOptions))
    .on('error', conf.errorHandler('Less'))
    .pipe($.autoprefixer())
    .on('error', conf.errorHandler('Autoprefixer'))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve/app/')));
};
