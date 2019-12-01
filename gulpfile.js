'use strict';

const browserify  = require('browserify');
const babelify    = require('babelify');
const gulp        = require('gulp');
const source      = require('vinyl-source-stream');
const buffer      = require('vinyl-buffer');
const uglify      = require('gulp-uglify');
const sourcemaps  = require('gulp-sourcemaps');
const log         = require('gulplog');
const eslint      = require('gulp-eslint');
const browsersync = require('browser-sync');
const rename      = require('gulp-rename');
const concat      = require('gulp-concat');
const babel       = require('gulp-babel');
const plumber     = require('gulp-plumber');
const tap         = require('gulp-tap');

const project_name = 'ThreeJS'

const babel_config = {
  presets: [
    "@babel/preset-env"
  ]
}

gulp.task('jshint', () => {
  return gulp
    .src('/src/js/*.js')
    .pipe(plumber())
    .pipe(eslint())
    .pipe(eslint.format());
})

gulp.task('js', () => {

  const stream = gulp
    .src('src/js/*.js', {read: false})
    .pipe(tap((file) => {

      file.contents = browserify(file.path, {debug: true})
                        .transform(babelify, babel_config)
                        .bundle()
                        .on('error', (err) => {
                          process.stdout.write(err.stack);
                          stream.emit('end');
                        });
    }))
    .pipe(plumber())
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist'))
    .pipe(browsersync.reload({stream: true}));


  return stream;
});

gulp.task('browser-sync', gulp.series('js', () => {
  return browsersync.init({
    open: true,
    browser: 'chrome',
    port: 3000,
    server: './dist',
    logPrefix: project_name
  });
}));

gulp.task('watch', () => {
  gulp.watch('./src/js/*.js', gulp.series('js'));
  gulp.watch('./dist/index.html', gulp.series(browsersync.reload));
});

gulp.task('default', gulp.series('browser-sync', 'watch'));
