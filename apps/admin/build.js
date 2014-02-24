var gulp = require('gulp'),
    gulpless = require('gulp-less'),
    gulpconcat = require('gulp-concat'),
    gulpinject = require('gulp-inject'),
    gulpuglify = require('gulp-uglify'),
    gulpreplace = require('gulp-replace'),
    gulpkss = require('gulp-kss'),
    gulputil = require('gulp-util'),
    gulpcomponentloader = require('../../../gulp-component-loader'),
    es = require('event-stream'),
    lr = require('tiny-lr'),
    livereload = require('gulp-livereload'),
    server = lr(),
    path = require('path');

module.exports = function (options, components) {
    // cache name of output scripts and styles to inject them into html
    var scriptCache = [],
        styleCache = [],
        watcherStarted = false;

    var config = {
        env: options.env || process.env.NODE_ENV,
        angular: {
            modules: (options.angular && options.angular.modules) ? options.angular.modules : []
        }, 
        html: {
            src:  (options.html && options.html.src)  ? options.html.src : [],
            dest: (options.html && options.html.dest) ? options.html.dest : __dirname + '/build'
        },
        copy: {
            src:  (options.copy && options.copy.src)  ? options.copy.src : [],
            dest: (options.copy && options.copy.dest) ? options.copy.dest : __dirname + '/build'
        },
        js: {
            src:  (options.js && options.js.src)  ? options.js.src : [],
            dest: (options.js && options.js.dest) ? options.js.dest : __dirname + '/build',
            concat: (options.js && options.js.concat)  ? options.js.concat : 'js/all.js'
        },
        css: {
            src:  (options.css && options.css.src)  ? options.css.src : [],
            concat: (options.css && options.css.concat)  ? options.css.concat : 'css/all.css',
            dest: (options.css && options.css.dest) ? options.css.dest : __dirname + '/build'
        },
        less: {
            src:  (options.less && options.less.src)  ? options.less.src : [],
            paths: (options.less && options.less.paths)  ? options.less.paths : ['node_modules/bauhausjs/backend/client/css/'],
        }
    };

    components = [
        'node_modules/bauhausjs/backend/client/component.json', 
        'node_modules/bauhausjs/backend/client/components/font-awesome/component.json', 
        'node_modules/bauhausjs/page/client/component.json', 
        'node_modules/bauhausjs/security/client/component.json', 
        'node_modules/bauhausjs/document/client/component.json'
    ];

    gulp.task('styles', function () {
        styleCache = [];
        return gulp.src(components)
         .pipe(gulpcomponentloader({types: ['styles']}))
         .pipe(gulpless({paths: config.less.paths}))
         .pipe((config.env === 'production') ? gulpconcat(config.css.concat) : gulputil.noop())
         .pipe(gulp.dest(config.css.dest))
         .pipe((config.env === 'development' && watcherStarted) ? livereload(server) : gulputil.noop())
         .pipe(gulputil.buffer(function(err, files){
              for (var f in files) {
                  styleCache.push(files[f].path);
              }
          }))
    });

    gulp.task('scripts', function () {
        scriptCache = [];
        return gulp.src(components)
         .pipe(gulpcomponentloader({types: ['scripts']}))
                   //.pipe((config.env === 'production') ? gulpuglify() :  gulputil.noop())
                   .pipe((config.env === 'production') ? gulpconcat(config.js.concat) : gulputil.noop())
                   .pipe(gulp.dest(config.js.dest))
                   .pipe((config.env === 'development' && watcherStarted) ? livereload(server) : gulputil.noop())
                   .pipe(gulputil.buffer(function(err, files){
                        for (var f in files) {
                            scriptCache.push(files[f].path);
                        }
                    }));
    });

    gulp.task('html', function () {
        return gulp.src(components)
                   .pipe(gulpcomponentloader({types: ['templates']}))
                   .pipe(gulp.dest(config.html.dest))
                   .pipe((config.env === 'development' && watcherStarted) ? livereload(server) : gulputil.noop());
    });

    gulp.task('copy', function () {
        return gulp.src(components)
                   .pipe(gulpcomponentloader({types: ['fonts']}))
                   .pipe(gulp.dest(config.copy.dest))
                   .pipe((config.env === 'development' && watcherStarted) ? livereload(server) : gulputil.noop());
    });

    gulp.task('index.ejs', ['scripts', 'styles'], function (src) {
        var indexSrc = __dirname + '../../../node_modules/bauhausjs/backend/templates/index.ejs',
            indexDest = __dirname + '/build/templates/';

        var assetScr = styleCache.concat(scriptCache);

        var angularModules = '["' + config.angular.modules.join('","') + '"]';

        return gulp.src(assetScr, {read: false})
            .pipe(gulpinject(indexSrc, { ignorePath: 'apps/admin/build/client/', addRootSlash: false }))
            .pipe(gulpreplace(/(angular\.module\(\'bauhaus\'\, )(\[\])(\))/, '$1' + angularModules + '$3'))
            .pipe(gulp.dest(indexDest));
    });

    gulp.task('styleguide', function () {
        config.styleguide = {
            src: [__dirname + '../../../node_modules/bauhausjs/backend/client/css/*.less']
        }

        gulp.src(config.styleguide.src)
            .pipe(gulpkss({
                overview: __dirname + '/client/css/styleguide.md'
            }))
            .pipe(gulp.dest(__dirname + '/build/client/styleguide/'));

        // Concat and compile all your styles for correct rendering of the styleguide.
        gulp.src(components)
         .pipe(gulpcomponentloader({types: ['styles']}))
         .pipe(gulpless({paths: config.less.paths }))
         .pipe(gulpconcat('public/style.css'))
         .pipe(gulp.dest(__dirname + '/build/client/styleguide/'));
    });

    gulp.task('watch', ['styles', 'scripts', 'html'], function () {
        watcherStarted = true;
        gulp.watch(styleCache, ['styles']);
        gulp.watch(scriptCache, ['scripts']);
        gulp.watch(config.html.src, ['html']);
        gulp.watch(config.copy.src, ['copy']);

        server.listen(35729, function(err) {
            if (err) return console.error(err);
        });
    });


    gulp.task('production', ['styles', 'scripts', 'html', 'copy', 'index.ejs']);

    gulp.task('development', ['styles', 'scripts', 'html', 'copy', 'index.ejs', 'styleguide', 'watch']);

    return gulp;
}