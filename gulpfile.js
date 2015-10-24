'use strict';

var config = {
	mainFileName: 'bloom-angular-seed.js',
	stylesFileName: 'bloom-angular-seed.css'
};

// Gulp Dependencies
var gulp = require('gulp');
var rename = require('gulp-rename');

//Angular Dependencies
var ngAnnotate = require('gulp-ng-annotate');

// Build Dependencies
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');

// Style Dependencies
var less = require('gulp-less');
var prefix = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');

// Development Dependencies
var jshint = require('gulp-jshint');

// Test Dependencies
var mochaPhantomjs = require('gulp-mocha-phantomjs');

gulp.task('lint-client', function() {
  return gulp.src('./client/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('lint-test', function() {
  return gulp.src('./test/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('browserify-client', ['lint-client'], function() {
  return gulp.src('client/index.js')
    .pipe(browserify({
      insertGlobals: true
    }))
    .pipe(ngAnnotate())
    .pipe(rename(config.mainFileName))
    .pipe(gulp.dest('build'))
    .pipe(gulp.dest('public/scripts'));
});

gulp.task('browserify-test', ['lint-test'], function() {
  return gulp.src('test/client/index.js')
    .pipe(browserify({
      insertGlobals: true
    }))
    .pipe(rename('client-test.js'))
    .pipe(gulp.dest('build'));
});

gulp.task('watch', function() {
  gulp.watch('client/**/*.js', ['browserify-client']);
  gulp.watch('test/client/**/*.js', ['browserify-test']);
});

gulp.task('test', ['lint-test', 'browserify-test'], function() {
  return gulp.src('test/client/index.html')
    .pipe(mochaPhantomjs());
});

gulp.task('watch', function() {
  gulp.watch('client/**/*.js', ['browserify-client', 'test']);
  gulp.watch('test/client/**/*.js', ['test']);
});

gulp.task('styles', function() {
  return gulp.src('client/less/index.less')
    .pipe(less())
    .pipe(prefix({ cascade: true }))
    .pipe(rename(config.stylesFileName))
    .pipe(gulp.dest('build'))
    .pipe(gulp.dest('public/styles'));
});

gulp.task('minify', ['styles'], function() {
	var splittedStyleFileName = config.stylesFileName.split('.');
  console.log(splittedStyleFileName);
	var minifiedStyleFileName = splittedStyleFileName[0] + '.min.'+splittedStyleFileName[1];
  return gulp.src('build/'+config.stylesFileName)
    .pipe(minifyCSS())
    .pipe(rename(minifiedStyleFileName))
    .pipe(gulp.dest('public/styles'));
});

gulp.task('uglify', ['browserify-client'], function() {
  var splittedMainFileName = config.mainFileName.split('.');
  var minifiedMainFileName = splittedMainFileName[0] + '.min.'+ splittedMainFileName[1];
  return gulp.src('build/'+config.mainFileName)
    .pipe(uglify())
    .pipe(rename(minifiedMainFileName))
    .pipe(gulp.dest('public/scripts'));
});

gulp.task('build', ['uglify', 'minify']);

gulp.task('default', ['test', 'build', 'watch']);