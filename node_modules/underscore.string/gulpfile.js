var gulp = require('gulp-param')(require('gulp'), process.argv),
  qunit = require("gulp-qunit"),
  uglify = require('gulp-uglify'),
  clean = require('gulp-clean'),
  bump = require('gulp-bump'),
  replace = require('gulp-replace'),
  rename = require('gulp-rename'),
  browserify = require('gulp-browserify'),
  SRC = 'index.js',
  DEST = 'dist',
  SRC_COMPILED = 'underscore.string.js',
  MIN_FILE = 'underscore.string.min.js',
  TEST_SUITES = ['test/test.html', 'test/test_standalone.html', 'test/test_underscore/index.html'],
  VERSION_FILES = ['./package.json', './component.json', './bower.json'];

gulp.task('test', ['browserify'], function() {
  return gulp.src(TEST_SUITES)
    .pipe(qunit());
});

gulp.task('browserify', function() {
  return gulp.src(SRC)
    .pipe(browserify({
      detectGlobals: true,
      standalone: 's'
    }))
    .pipe(rename('underscore.string.js'))
    .pipe(gulp.dest(DEST));
});

gulp.task('clean', function() {
  return gulp.src(DEST)
    .pipe(clean());
});

gulp.task('bump-in-js', function(semver) {
  return gulp.src(SRC)
    .pipe(replace(/(version\s?=?\s\')([\d\.]*)\'/gi, '$1' + semver + "'"))
    .pipe(gulp.dest('./'));
});

// usage: gulp bump -s <% Version %>
// usage: gulp bump --semver <% Version %>
gulp.task('bump', ['bump-in-js'], function(semver) {
  if (typeof semver !== 'string' || semver.length <= 0) {
    console.error('pass a new version `gulp bump --semver 2.4.1`');
    process.exit(1);
  }

  return gulp.src(VERSION_FILES)
    .pipe(bump({
      version: semver
    }))
    .pipe(gulp.dest('./'));
});

gulp.task('build', ['test', 'clean'], function() {
  gulp.src(DEST + '/' + SRC_COMPILED)
    .pipe(uglify())
    .pipe(rename(MIN_FILE))
    .pipe(gulp.dest(DEST));
});
