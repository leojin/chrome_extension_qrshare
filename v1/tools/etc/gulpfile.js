'use strict';

var gulp = require('gulp');
var colors = require('colors/safe');
var lazypipe = require('lazypipe');
var fs = require('fs');
var path = require('path');
var $$ = require('gulp-load-plugins')();

/**
 * basic path
 *
 */
var pathRoot = process.cwd().replace('/tools/etc', '');
var pathSrc = pathRoot + '/src';
var pathSrcStatic = pathSrc + '/static';
var pathSrcTpl = pathSrc + '/page';

/**
 * globs for watch
 *
 */
var globWatchStaticJs = [
    pathSrcStatic + '/lib/**/*.js',
    pathSrcStatic + '/page/**/*.js'
];
var globWatchStaticScss = [
    pathSrcStatic + '/lib/**/*.scss',
    pathSrcStatic + '/page/**/*.scss'
];
var globWatchStaticOther = [
    pathSrcStatic + '/img/**',
    pathSrcStatic + '/vendor/**'
];
var globWatchManifest = [
    pathSrc + '/manifest.json'
];
var globWatchTpl = [
    pathSrcTpl + '/**'
];

/**
 * globs for Build
 *
 */
var globBuildStaticJs = [
    pathSrcStatic + '/lib/**/*.js',
    pathSrcStatic + '/page/**/*.js'
];
var globBuildStaticScss = [
    pathSrcStatic + '/lib/**/*.scss',
    pathSrcStatic + '/page/**/*.scss'
];
var globBuildStaticOther = [
    pathSrcStatic + '/img/**',
    pathSrcStatic + '/vendor/**'
];
var globBuildManifest = [
    pathSrc + '/manifest.json'
];
var globBuildTpl = [
    pathSrcTpl + '/**'
];

/**
 * dist for dev
 *
 */
var distDevRoot = pathRoot + '/tmp';
var distDevStatic = distDevRoot + '/static';
var distDevPage = distDevRoot + '/page';

/**
 * dist for release
 *
 */
var distReleaseRoot = pathRoot + '/output';
var distReleaseStatic = distReleaseRoot + '/static';
var distReleasePage = distReleaseRoot + '/page';

/**
 * utils
 *
 */
var utils = {
    regWatch: function (glob, task, callback) {
        var watch = (Object.prototype.toString.call(task) === '[object Array]' &&
            task.length !== 0) ?
            gulp.watch(glob, task):
            gulp.watch(glob);

        var globStr = '';
        if (Object.prototype.toString.call(glob) === '[object Array]') {
            var globArr = [];
            glob.forEach(function (obj) {
                globArr.push(obj.replace(pathSrc + '/', ''));
            });
            globStr = globArr.join(' ');
        } else {
            globStr = glob.replace(pathSrc + '/', '');
        }
        console.log(colors.blue('Watching'), globStr);

        watch.on('change', function (ev) {
            console.log(colors.green('Change Catched:'), ev.path.replace(pathSrc + '/', ''));
            typeof callback === 'function' && ev.type === 'changed' && callback.call(this, ev);
        });
    }
};

/**
 * Pipes
 *
 */
var scssOpt = {
    includePaths: [pathSrcStatic]
};
var fileIncludeTplOpt = {
    prefix: '@@',
    basepath: pathSrcTpl
};
var fileIncludeJsOpt = {
    prefix: '@@',
    basepath: pathSrcStatic
};
var pipeInsScss = lazypipe()
    .pipe(function (opt, cb) {
        return $$.sass(opt).on('error', cb);
    }, scssOpt, $$.sass.logError);
var pipeInsTpl = lazypipe()
    .pipe($$.fileInclude, fileIncludeTplOpt);
var pipeInsJs = lazypipe()
    .pipe($$.fileInclude, fileIncludeJsOpt);
var pipeInsJSCompress = lazypipe()
    .pipe($$.uglify, {
        compress: {
            sequences     : true,  // join consecutive statemets with the “comma operator”
            properties    : true,  // optimize property access: a["foo"] → a.foo
            dead_code     : true,  // discard unreachable code
            drop_debugger : true,  // discard “debugger” statements
            unsafe        : false, // some unsafe optimizations (see below)
            conditionals  : true,  // optimize if-s and conditional expressions
            comparisons   : true,  // optimize comparisons
            evaluate      : true,  // evaluate constant expressions
            booleans      : true,  // optimize boolean expressions
            loops         : true,  // optimize loops
            unused        : false,  // drop unused variables/functions
            hoist_funs    : true,  // hoist function declarations
            hoist_vars    : false, // hoist variable declarations
            if_return     : true,  // optimize if-s followed by return/continue
            join_vars     : true,  // join var declarations
            cascade       : true,  // try to cascade `right` into `left` in sequences
            side_effects  : true,  // drop side-effect-free statements
            warnings      : true,  // warn about potentially dangerous optimizations/code
            global_defs   : {}     // global definitions
        }
    });

/**
 * tasks for dev
 *
 */
gulp.task('build:dev:static:js', function () {
    return gulp.src(globBuildStaticJs, {
        base: pathSrcStatic
    })
        .pipe(pipeInsJs())
        .pipe(gulp.dest(distDevStatic + '/'));
});
gulp.task('build:dev:static:scss', function () {
    return gulp.src(globBuildStaticScss, {
        base: pathSrcStatic
    })
        .pipe(pipeInsScss())
        .pipe(gulp.dest(distDevStatic + '/'));
});
gulp.task('build:dev:static:other', function () {
    return gulp.src(globBuildStaticOther, {
        base: pathSrcStatic
    })
        .pipe(gulp.dest(distDevStatic + '/'));
});
gulp.task('build:dev:tpl', function () {
    return gulp.src(globBuildTpl, {
        base: pathSrcTpl
    })
        .pipe(gulp.dest(distDevPage + '/'));
});
gulp.task('build:dev:manifest', function () {
    return gulp.src(globBuildManifest)
        .pipe(gulp.dest(distDevRoot + '/'));
});
gulp.task('init:dev', function (cb) {
    console.log(colors.blue('Initializing'));
    $$.sequence([
        'build:dev:static:js',
        'build:dev:static:scss',
        'build:dev:static:other',
        'build:dev:manifest'
    ], [
        'build:dev:tpl'
    ], cb);
});
gulp.task('watch', ['init:dev'], function () {
    utils.regWatch(globWatchStaticJs, [], function (ev) {
        gulp.src(globWatchStaticJs, {
            base: pathSrcStatic
        })
            .pipe(pipeInsJs())
            .pipe(gulp.dest(distDevStatic + '/'));
    });
    utils.regWatch(globWatchStaticScss, [], function (ev) {
        gulp.src(globWatchStaticScss, {
            base: pathSrcStatic
        })
            .pipe(pipeInsScss())
            .pipe(gulp.dest(distDevStatic + '/'));
    });
    utils.regWatch(globWatchStaticOther, [], function (ev) {
        gulp.src(globWatchStaticOther, {
            base: pathSrcStatic
        })
            .pipe(gulp.dest(distDevStatic + '/'));
    });
    utils.regWatch(globWatchTpl, [], function (ev) {
        gulp.src(globWatchTpl, {
            base: pathSrcTpl
        })
            .pipe(gulp.dest(distDevPage + '/'));
    });
    utils.regWatch(globWatchManifest, [], function (ev) {
        gulp.src(globWatchManifest)
            .pipe(gulp.dest(distDevRoot + '/'));
    })
});
/**
 * tasks for release
 *
 */
gulp.task('clean', function () {
    return gulp.src(distReleaseRoot)
        .pipe($$.clean({
            force: true
        }));
});
gulp.task('build:release:static:js', function () {
    return gulp.src(globBuildStaticJs, {
        base: pathSrcStatic
    })
        .pipe(pipeInsJs())
        .pipe(pipeInsJSCompress())
        .pipe(gulp.dest(distReleaseStatic + '/'));
});
gulp.task('build:release:static:scss', function () {
    return gulp.src(globBuildStaticScss, {
        base: pathSrcStatic
    })
        .pipe(pipeInsScss())
        .pipe($$.minifyCss())
        .pipe(gulp.dest(distReleaseStatic + '/'));
});
gulp.task('build:release:static:other', function () {
    return gulp.src(globBuildStaticOther, {
        base: pathSrcStatic
    })
        .pipe(gulp.dest(distReleaseStatic + '/'));
});
gulp.task('build:release:tpl', function () {
    return gulp.src(globBuildTpl, {
        base: pathSrcTpl
    })
        .pipe($$.htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(distReleasePage + '/'));
});
gulp.task('build:release:manifest', function () {
    return gulp.src(globBuildManifest)
        .pipe(gulp.dest(distReleaseRoot + '/'));
});
gulp.task('build:release:pack', function () {
    return gulp.src(distReleaseRoot + '/**/*', {
        base: distReleaseRoot
    })
        .pipe($$.zip('release.zip'))
        .pipe(gulp.dest(distReleaseRoot + '/'));
});
gulp.task('init:release', ['clean'], function (cb) {
    console.log(colors.blue('Initializing'));
    $$.sequence([
        'build:release:static:js',
        'build:release:static:scss',
        'build:release:static:other',
        'build:release:manifest'
    ], [
        'build:release:tpl'
    ], [
        'build:release:pack'
    ], cb);
});

/**
 * Tasks For Command
 *
 */
gulp.task('build:dev', ['init:dev', 'watch']);
gulp.task('build:release', ['clean', 'init:release']);
gulp.task('help', function () {
    console.log(colors.blue('Task List:'));
    console.log(colors.green('build:dev'));
    console.log(colors.green('build:release'));
});
gulp.task('default', ['help']);