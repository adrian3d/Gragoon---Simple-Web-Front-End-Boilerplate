var gulp = require('gulp-param')(require('gulp'), process.argv);;
var sass = require('gulp-sass');
var gulpif = require('gulp-if');
var livereload = require('gulp-livereload');
var sourcemaps = require('gulp-sourcemaps');
var postcss  = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var gpRename = require('gulp-rename');
var eslint = require('gulp-eslint');
var webpack = require('webpack-stream');
var plumber = require('gulp-plumber');
var concat = require('gulp-concat');
var runSequence = require('run-sequence');
var sassbulkImport = require('gulp-sass-bulk-import');
var rewriteCss = require('gulp-rewrite-css');
var cleanCss = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync').create();
var cond = require('gulp-cond');
var runTimestamp = Math.round(Date.now()/1000);
var svgmin = require('gulp-svgmin');
var prettyError = require('gulp-prettyerror');
var imagemin = require('gulp-imagemin');
var mqpacker = require('css-mqpacker');
const fs = require('fs');

var config = require('./config.json');

// Paths
const paths = {
  dist: './dist',
  src: './sources',
  folders: {
    styles: '/styles',
    scss: '/styles',
    js: '/js',
    libs: '/libs',
    img: '/img',
    fonts: '/fonts',
    icons: '/icons',
    svg: '/svg'
  }
}

// Compile JS
gulp.task('js', function() {
  gulp.src(paths.src + paths.folders.js + '/**/*.js')
    .pipe(eslint())
    .pipe(eslint.format());

  return gulp.src([paths.src + paths.folders.js + '/app.js'])
    .pipe(cond(!config.prod, sourcemaps.init()))
    .pipe(plumber())
    .pipe(webpack({
      output: {
        filename: '[name].js'
      }
    }))
    .pipe(cond(config.prod, uglify()))
    .pipe(gpRename('app.min.js'))
    .pipe(cond(!config.prod, sourcemaps.write()))
    .pipe(gulp.dest(paths.dist + paths.folders.js))
    .pipe(livereload());
});

// Concat JS libs
gulp.task('libs', function() {
  gulp.src(paths.src + paths.folders.libs + '/*.js')
    .pipe(concat('libs.js'))
    .pipe(gulp.dest(paths.dist + paths.folders.libs));

  return gulp.src(paths.src + paths.folders.libs + '/*.css')
    .pipe(concat('libs.css'))
    .pipe(cleanCss())
    .pipe(gulp.dest(paths.dist + paths.folders.libs));
});

// Compile styles
gulp.task('styles', function(prod) {
  config.prod = typeof prod !== 'undefined' ? true : false;

  return gulp.src(paths.src + paths.folders.scss + '/styles.scss')
    .pipe(prettyError())
    .pipe(plumber())
    .pipe(cond(!config.prod, sourcemaps.init()))
    .pipe(sassbulkImport())
    .pipe(sass()
    .on('error', sass.logError))
    .pipe(postcss(
      [
        autoprefixer({
          browsers: ['last 10 versions','ie >=9'],
          map: true
        }),
        mqpacker()
      ]))
    .pipe(rewriteCss({
      debug: true,
      destination: paths.dist + paths.folders.styles
    }))
    .pipe(cond(config.prod, cleanCss()))
    .pipe(cond(!config.prod, sourcemaps.write()))
    .pipe(gulp.dest(paths.dist + paths.folders.styles))
    .pipe(livereload());
});

// Watch files in order to auto compile files
gulp.task('watch', function(bs, prod) {
  livereload.listen();

  if (typeof bs !== 'undefined') {
    bs = typeof bs === 'string' ? bs : config.localhost;

    browserSync.init({
      proxy: bs
    });
  }

  config.prod = typeof prod !== 'undefined' ? true : false;

  gulp.watch(paths.src + paths.folders.scss + '/**/*.scss', ['styles']);
  gulp.watch([
    paths.src + paths.folders.js + '/app.js',
    paths.src + paths.folders.js + '/components/*.js',
    paths.src + paths.folders.js + '/misc/*.js'], ['js']);
});


gulp.task('svg-min', function() {
  return gulp.src([paths.src + paths.folders.svg + '/*.svg'])
    .pipe(prettyError())
    .pipe(svgmin())
    .pipe(gulp.dest(paths.dist + paths.folders.svg));
});

gulp.task('img-min', function() {
  return gulp.src([paths.src + paths.folders.img + '/*'])
    .pipe(prettyError())
    .pipe(imagemin())
    .pipe(gulp.dest(paths.dist + paths.folders.img));
});

// Run all tasks
gulp.task('build', function(prod) {
  config.prod = typeof prod !== 'undefined' ? true : false;

  if (typeof config.build !== 'object') {
    config.build = ['svg-min', 'styles', 'js', 'libs'];
  }

  runSequence(config.build);
});
