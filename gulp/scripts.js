

const path = require('path');
const gulp = require('gulp');
const conf = require('./conf');

const browserSync = require('browser-sync');

const $ = require('gulp-load-plugins')();


gulp.task('scripts-reload', () => buildScripts()
  .pipe(browserSync.stream()));

gulp.task('scripts', () => buildScripts());

function buildScripts() {
  return gulp.src(path.join(conf.paths.src, '/app/**/*.js'))
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.size());
}
