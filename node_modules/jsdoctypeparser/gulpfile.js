'use strict';

var gulp = require('gulp');
var watch = require('gulp-watch');
var peg = require('gulp-peg');
var gutil = require('gulp-util');
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');

var PEG_FILES = 'peg_src/**/*.pegjs';
var COMPILED_PEG_FILE = 'peg_lib';

gulp.task('watch', function() {
  return gulp.src(PEG_FILES)
    .pipe(plumber({ errorHandler: notify.onError('<%= error.message %>') }))
    .pipe(watch(PEG_FILES))
    .pipe(peg().on('error', gutil.log))
    .pipe(notify('Compiled: <%= file.relative %>!'))
    .pipe(gulp.dest(COMPILED_PEG_FILE));
});

gulp.task('peg', function() {
  return gulp.src(PEG_FILES)
    .pipe(peg().on('error', gutil.log))
    .pipe(gulp.dest(COMPILED_PEG_FILE));
});

gulp.task('build', ['peg']);
