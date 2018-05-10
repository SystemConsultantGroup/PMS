

const path = require('path');
const gulp = require('gulp');
const conf = require('./conf');

const nodemon = require('gulp-nodemon');

gulp.task('set-dev-node-env', () => process.env.NODE_ENV = 'development');

gulp.task('set-prod-node-env', () => process.env.NODE_ENV = 'production');


gulp.task('express', ['watch', 'set-dev-node-env'], () => nodemon({
  script: path.join(conf.paths.server, 'app.js'),
  watch: conf.paths.server
}));

gulp.task('express:dist_fasterbuild', ['set-buildtype-faster', 'build', 'set-prod-node-env'], () => nodemon({
  script: path.join(conf.paths.server, 'app.js'),
  watch: conf.paths.server
}));

gulp.task('express:dist_wobuild', ['set-prod-node-env'], () => nodemon({
  script: path.join(conf.paths.server, 'app.js'),
  watch: conf.paths.server
}));


gulp.task('express:dist', ['set-buildtype-normal', 'build', 'set-prod-node-env'], () => nodemon({
  script: path.join(conf.paths.server, 'app.js'),
  watch: conf.paths.server
}));


// gulp.task('reload:browser', function (callback)
// {
//     var called = false;
//      return nodemon({
//        script: path.join(conf.paths.server, 'app.js'),
//        ignore: [
//          'gulpfile.js',
//          'node_modules/',
//          'client/',
//          'bower_components/'
//        ]
//      })
//      .on('start', function () {
//        if (!called) {
//          called = true;
//          callback();
//        }
//      })
//      .on('restart', function () {
//        setTimeout(function () {
//          reload({ stream: false });
//        }, 1000);
//      });
// });
