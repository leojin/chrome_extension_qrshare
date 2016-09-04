'use strict';

var gulp = require('gulp');
var colors = require('colors/safe');
var lazypipe = require('lazypipe');
var fs = require('fs');
var path = require('path');
var $$ = require('gulp-load-plugins')();

/**
 * Tasks For Command
 *
 */

gulp.task('build:dev', []);

gulp.task('build:release', []);

gulp.task('help', function () {
    console.log(colors.blue('Task List:'));
    console.log(colors.green('build:dev'));
    console.log(colors.green('build:release'));
});

gulp.task('default', ['help']);