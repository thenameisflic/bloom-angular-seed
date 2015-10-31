var gulp = require('gulp');
var outline = require('./outline.json');

gulp.task('default', ['build', 'watch']);
gulp.task('build', ['style', 'script', 'index']);
gulp.task('watch', WatchTask);
gulp.task('style', StyleTask);
gulp.task('script', ScriptTask);
gulp.task('index', IndexTask);
gulp.task('start-server', StartServerTask);
gulp.task('reload-browser', ReloadBrowserTask);
gulp.task('prepare-tests', PrepareTestsTask);
gulp.task('index-tests', IndexTestsTask);
gulp.task('run-tests', ['prepare-tests', 'index-tests'], RunTestsTask);

var concat = require('gulp-concat');
var gutil = require('gulp-util');
var browserSync = require('browser-sync');

var args = require('yargs')
  .alias('p', 'prod')
  .default('prod', false)
  .argv;

var minifyCss = require('gulp-minify-css');
var gulpif = require('gulp-if');

function StyleTask () {
	return gulp.src(outline.src + '/css/**/*.css')
			.pipe(concat(withMinCSS(outline.name))).on('error', gutil.log)
			.pipe(minifyCss()).on('error', gutil.log)
			.pipe(gulp.dest(outline.dist + '/css/')).on('error', gutil.log)
			.pipe(browserSync.stream());
}

var uglify = require('gulp-uglify');

function ScriptTask () {
	return gulp.src(outline.src + '/js/**/*.js')
			.pipe(concat(withMinJS(outline.name))).on('error', gutil.log)
			.pipe(gulpif(args.prod, uglify())).on('error', gutil.log)
			.pipe(gulp.dest(outline.dist + '/js/')).on('error', gutil.log);
}

var inject = require('gulp-inject');
var htmlreplace = require('gulp-html-replace');
var bowerFiles = require('main-bower-files');

var jsBundle = outline.dist + '/js/' + withMinJS(outline.name);
var cssBundle = outline.dist + '/css/' + withMinCSS(outline.name);

function IndexTask () {
	var defaultInjectionOptions = {
		addRootSlash: false,
		ignorePath: '/' + outline.dist,
		name: 'inject'
	};

	var bowerInjectionOptions = {
		addRootSlash: false,
		ignorePath: '/' + outline.dist,
		name: 'bower'
	};

	return gulp.src(outline.src + '/html/index.html')
  			.pipe(htmlreplace({'appTitle': outline.name}))
  			.pipe(inject(gulp.src(bowerFiles(), {read: false}), bowerInjectionOptions))
  			.pipe(inject(gulp.src(jsBundle, {read: false}), defaultInjectionOptions))
  			.pipe(inject(gulp.src(cssBundle, {read: false}), defaultInjectionOptions))
  			.pipe(gulp.dest(outline.dist));
}

function ReloadBrowserTask () {
	browserSync.reload();
}

var historyApiFallback = require('connect-history-api-fallback');
function StartServerTask () {
	browserSync.init({
      server: {
          baseDir: outline.dist,
          middleware: [ historyApiFallback() ]
      }
  });
}

function WatchTask () {
	StartServerTask();

	gulp.watch(outline.src + '/js/**/*.js', ['script', 'reload-browser', 'run-tests']);
	gulp.watch(outline.test + '/unit/**/*.test.js', ['run-tests']);
  	gulp.watch(outline.src + '/css/**/*.css', ['style']);
  	gulp.watch(outline.src + '/html/**/*.html', ['index', 'reload-browser']);
  	gulp.watch(outline.src + '/lib/**/*.{js,css}', ['index', 'reload-browser']);
}

function PrepareTestsTask () {
	return gulp.src(outline.test + '/unit/**/*.test.js')
		    .pipe(concat(outline.test + '/runnable/' + outline.name + '.test.js')).on('error', gutil.log)
		    .pipe(gulp.dest(''));
}

function IndexTestsTask () {
	var defaultTestInjectionOptions = {
		    addRootSlash: false,
		    relative: true,
		    name: 'inject'
	};
	var bowerTestInjectionOptions = {
		    addRootSlash: false,
		    relative: true,
		    name: 'bower'
	};
	return gulp.src(outline.test + '/unit/index.html')
			.pipe(htmlreplace({'testFile': outline.name + '.test.js'}))
			.pipe(inject(gulp.src(bowerFiles(), {read: false}), bowerTestInjectionOptions))
			.pipe(inject(gulp.src(outline.dist + '/js/' + withMinJS(outline.name), {read: false}), defaultTestInjectionOptions))
			.pipe(gulp.dest(outline.test + '/runnable'));
}

var mochaPhantomjs = require('gulp-mocha-phantomjs');

function RunTestsTask () {
	return gulp.src(outline.test + '/runnable/index.html')
    .pipe(mochaPhantomjs());
}

function withMinJS (file) {
	return file + '.min.js';
}

function withMinCSS (file) {
	return file + '.min.css';
}