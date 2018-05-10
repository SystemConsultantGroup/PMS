

const path = require('path');
const gulp = require('gulp');
const conf = require('./conf');

const browserSync = require('browser-sync');

function isOnlyChange(event) {
  return event.type === 'changed';
}

gulp.task('watch', ['inject'], () => {
  gulp.watch([path.join(conf.paths.src, '/*.html'), 'bower.json'], ['inject-reload']);

  gulp.watch(path.join(conf.paths.src, '/app/**/*.css'), (event) => {
    if (isOnlyChange(event)) {
      browserSync.reload(event.path);
    } else {
      gulp.start('inject-reload');
    }
  });

  gulp.watch(path.join(conf.paths.src, '/app/**/*.js'), (event) => {
    if (isOnlyChange(event)) {
      gulp.start('scripts-reload');
    } else {
      gulp.start('inject-reload');
    }
  });

  gulp.watch(path.join(conf.paths.src, '/app/**/*.html'), (event) => {
    browserSync.reload(event.path);
  });
});
