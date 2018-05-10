

const path = require('path');
const gulp = require('gulp');
const conf = require('./conf');
const gutil = require('gulp-util');

const $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

gulp.task('set-buildtype-faster', () => {
  process.env.BUILD_TYPE = 'faster';
});

gulp.task('set-buildtype-normal', () => {
  process.env.BUILD_TYPE = 'normal';
});

gulp.task('partials', () => gulp.src([
  path.join(conf.paths.src, '/app/**/*.html'),
  path.join(conf.paths.tmp, '/serve/app/**/*.html')
])
  .pipe($.htmlmin({
    removeEmptyAttributes: true,
    removeAttributeQuotes: true,
    collapseBooleanAttributes: true,
    collapseWhitespace: true
  }))
  .pipe($.angularTemplatecache('templateCacheHtml.js', {
    module: 'gradsys',
    root: 'app'
  }))
  .pipe(gulp.dest(`${conf.paths.tmp}/partials/`)));

gulp.task('html', ['inject', 'partials'], () => {
  const partialsInjectFile = gulp.src(path.join(conf.paths.tmp, '/partials/templateCacheHtml.js'), { read: false });
  const partialsInjectOptions = {
    starttag: '<!-- inject:partials -->',
    ignorePath: path.join(conf.paths.tmp, '/partials'),
    addRootSlash: false
  };

  const htmlFilter = $.filter('*.html', { restore: true });
  const jsFilter = $.filter('**/*.js', { restore: true });
  const cssFilter = $.filter('**/*.css', { restore: true });
  const xfilter = $.filter('xx', { restore: true });

  return gulp.src(path.join(conf.paths.tmp, '/serve/*.html'))
    .pipe($.inject(partialsInjectFile, partialsInjectOptions))
    .pipe($.useref())
    .pipe(process.env.BUILD_TYPE === 'faster' ? xfilter : jsFilter)
    .pipe($.sourcemaps.init())
    .pipe($.ngAnnotate())
    .pipe($.uglify({ preserveComments: $.uglifySaveLicense }))
    .on('error', conf.errorHandler('Uglify'))
    .pipe($.rev())
    .pipe($.sourcemaps.write('maps'))
    .pipe(process.env.BUILD_TYPE === 'faster' ? xfilter.restore : jsFilter.restore)
    .pipe(cssFilter)
    // .pipe($.sourcemaps.init())
    .pipe($.cssnano())
    .pipe($.rev())
    // .pipe($.sourcemaps.write('maps'))
    .pipe(cssFilter.restore)
    .pipe($.revReplace())
    .pipe(htmlFilter)
    .pipe($.htmlmin({
      removeEmptyAttributes: true,
      removeAttributeQuotes: true,
      collapseBooleanAttributes: true,
      collapseWhitespace: true
    }))
    .pipe(htmlFilter.restore)
    .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
    .pipe($.size({ title: path.join(conf.paths.dist, '/'), showFiles: true }));
});

// Only applies for fonts from bower dependencies
// Custom fonts are handled by the "other" task
gulp.task('fonts', () => gulp.src($.mainBowerFiles())
  .pipe($.filter('**/*.{eot,otf,svg,ttf,woff,woff2}'))
  .pipe($.flatten())
  .pipe(gulp.dest(path.join(conf.paths.dist, '/fonts/'))));

gulp.task('other', () => {
  const fileFilter = $.filter((file) => file.stat.isFile());

  return gulp.src([
    path.join(conf.paths.src, '/**/*'),
    path.join(`!${conf.paths.src}`, '/**/*.{html,css,js}')
  ])
    .pipe(fileFilter)
    .pipe(gulp.dest(path.join(conf.paths.dist, '/')));
});

gulp.task('clean', () => $.del([path.join(conf.paths.dist, '/'), path.join(conf.paths.tmp, '/')]));

gulp.task('ckeditor', () => {
  gulp.src(['bower_components/ckeditor/lang/**/*']).pipe(gulp.dest('dist/lang'));
  gulp.src(['bower_components/ckeditor/skins/**/*']).pipe(gulp.dest('dist/skins'));
});

gulp.task('other_gradsys', () => {
  gulp.src(['src/app/css/fonts/elusive/font/*']).pipe(gulp.dest('dist/font'));
  gulp.src(['src/app/css/fonts/linecons/font/*']).pipe(gulp.dest('dist/font'));
  gulp.src(['src/app/css/fonts/fontawesome/fonts/*']).pipe(gulp.dest('dist/fonts'));
});

gulp.task('build', ['html', 'fonts', 'other', 'other_gradsys', 'ckeditor']);
