var gulp = require('gulp-param')(require('gulp'), process.argv);;
var sass = require('gulp-sass');
var livereload = require('gulp-livereload');
var sourcemaps = require('gulp-sourcemaps');
var postcss  = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var gpRename = require('gulp-rename');
var jscs = require('gulp-jscs');
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

var config = {
  prod: false
};

// Paths
const paths = {
  dist: './dist',
  src: './sources',
  folders: {
    styles: '/styles',
    scss: '/styles',
    js: '/js',
    libs: '/libs',
    img: '/img'
  }
}

// Compile JS
gulp.task('js', function() {
  gulp.src(paths.src + paths.folders.js + '/**/*.js')
    .pipe(jscs())
    .pipe(jscs.reporter());

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
gulp.task('styles', function() {
  return gulp.src(paths.src + paths.folders.scss + '/styles.scss')
    .pipe(cond(!config.prod, sourcemaps.init()))
    .pipe(sassbulkImport())
    .pipe(sass({
      includePaths: [require( 'bourbon' ).includePaths]
    })
    .on('error', sass.logError))
    .pipe(postcss(
      [
        autoprefixer({ browsers: ['last 10 versions','ie >=9'] })
      ]))
    .pipe(rewriteCss({
      adaptPath: function (e) {
          console.log('Changement de l\'url du fichier ' + e.targetFile);
        },
      destination: paths.dist + paths.folders.img
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
    bs = typeof bs === 'string' ? bs : 'vr2.cinemur.dev';

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

// Run all tasks
gulp.task('build', function(prod) {
  config.prod = typeof prod !== 'undefined' ? true : false;

  runSequence(['styles', 'js', 'libs']);
});
