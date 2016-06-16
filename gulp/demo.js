'use strict';

var path = require('path');
var gulp = require('gulp');
var del = require('del');
var conf = require('../gulpfile.config');

var $ = require('gulp-load-plugins')();

gulp.task('copy:demo', function() {
  var outPath = 'dist';
  del.sync([path.join(outPath, '**')]);

  return gulp.src(path.join('demo', '**/*'))
    .pipe(gulp.dest(outPath));
});

gulp.task('build:demo', ['build', 'copy:demo'], function() {
  return gulp.src(path.join(conf.paths.dist, '**/*'))
    .pipe(gulp.dest(path.join('dist', conf.paths.dist)));
});
