var gulp = require('gulp');
var gulpif = require('gulp-if');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var less = require('gulp-less');
var minifyCss = require('gulp-minify-css');
var browserify = require('gulp-browserify');
var browserSync = require('browser-sync').create();

// Test Dependencies
var mochaPhantomjs = require('gulp-mocha-phantomjs');

var args = require('yargs')
  .alias('p', 'prod')
  .default('prod', false)
  .argv;

var proj = {
  public: './public/',
  source: './client/',
  lib: 'lib/',
  static: 'static/',
  scss: './scss/'
};

var tests = {
  source: './test/',
  unit: 'client/'
};

var files = {
  jsBundle: 'bloom-js-seed.min.js',
  cssBundle: 'bloom-js-seed.min.css',
  testBundle: 'bloom-js-seed.test.js'
};

var outputPaths = {
  dist: proj.public,
  test: tests.source,
  scripts: 'js',
  styles: 'css',
  html : [ proj.public + '**/*.html' ]
};

var inputPaths = {
  html: [ proj.source + 'index.html' ],
  images: [ proj.source + 'img/**/*' ],
  styles: [ proj.source + 'css/**/*.{css,less}' ],
  scripts: [ proj.source + 'js/**/*.js', '!' + proj.source + 'js/' + files.jsbundle], // exclude the file we write too
  statics: [ proj.source + proj.static + '**/*' ],
  libs: [ proj.source + proj.lib + '**/*'],
  less: [ proj.source + 'css/**/*.less' ],
  unit: [ tests.source + tests.unit + '**/*test.js', '!' + outputPaths.test +  files.testBundle ]
};

gulp.task('default', ['scripts', 'styles', 'test', 'watch']);

// scripts - clean dist dir then annotate, minify, concat
gulp.task('scripts', function() {
  gulp.src(inputPaths.scripts)
    .pipe(gulpif(args.prod, uglify())).on('error', gutil.log)
    .pipe(concat(files.jsBundle)).on('error', gutil.log)
    .pipe(gulp.dest(outputPaths.dist + outputPaths.scripts))
    .on('error', function (error) {
      console.error('' + error);
    });
});

// styles - min app css then copy min css to dist
gulp.task('styles', function() {
  gulp.src(inputPaths.styles)
    .pipe(gulpif(/[.]less$/, less())).on('error', gutil.log)
    .pipe(minifyCss()).on('error', gutil.log)
    .pipe(concat(files.cssBundle)).on('error', gutil.log)
    .pipe(gulp.dest(outputPaths.dist + outputPaths.styles))
    .pipe(browserSync.stream());
});

gulp.task('watch', function() {
  gulp.watch(inputPaths.scripts, ['scripts', 'test']);
  gulp.watch(inputPaths.styles, ['styles']);
});

gulp.task('compile-test', function() {
  return gulp.src(inputPaths.unit)
    .pipe(browserify({
      insertGlobals: true
    }))
    .pipe(concat(files.testBundle)).on('error', gutil.log)
    .pipe(gulp.dest(outputPaths.test));
});

gulp.task('reload-browsers', [], browserSync.reload);

gulp.task('serve', ['scripts', 'styles', 'test'], function () {
  browserSync.init({
      server: {
          baseDir: outputPaths.dist
      }
  });

  gulp.watch(inputPaths.scripts, ['scripts', 'test', 'reload-browsers']);
  gulp.watch(inputPaths.styles, ['styles']);
  gulp.watch(outputPaths.html, ['reload-browsers']);
});

gulp.task('test', ['compile-test'], function() {
  return gulp.src(outputPaths.test + 'index.html')
    .pipe(mochaPhantomjs());
});