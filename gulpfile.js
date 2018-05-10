/**
 *  Welcome to your gulpfile!
 *  The gulp tasks are split into several files in the gulp directory
 *  because putting it all here was too long
 */


const fs = require('fs');
const gulp = require('gulp');

/**
 *  This will load all js or coffee files in the gulp directory
 *  in order to load all gulp tasks
 */
fs.readdirSync('./gulp').filter((file) => (/\.(js|coffee)$/i).test(file)).map((file) => {
  require(`./gulp/${file}`);
});


/**
 *  Default task clean temporaries directories and launch the
 *  main optimization build task
 */
gulp.task('default', ['clean'], () => {
  gulp.start('build');
});
