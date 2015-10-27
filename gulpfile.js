'use strict';

// pluginy
var gulp            = require('gulp'),
    gutil           = require('gulp-util'),
    autoprefixer    = require('gulp-autoprefixer'),
    connect         = require('gulp-connect'),
    imagemin        = require('gulp-imagemin'),
    usemin          = require('gulp-usemin'),
    clean           = require('gulp-clean'),
    sass            = require('gulp-sass'),
    zip             = require('gulp-zip'),
    size            = require('gulp-size'),
    copy            = require('gulp-copy'),
    prettify        = require('gulp-prettify'),
    cache           = require('gulp-cache'),
    runSequence     = require('run-sequence').use(gulp);

// config do autoprefixera
var AUTOPREFIXER_BROWSERS = [
    'ie >= 8',
    'ie_mob >= 8',
    'ff >= 10',
    'chrome >= 10',
    'safari >= 7',
    'opera >= 11',
    'ios >= 7',
    'android >= 2',
    'bb >= 10'
];

// łączy sie z przegladarką na widok live
gulp.task('connect', function () {
    connect.server({
        root: ['.tmp', 'app'],
        port: 1338,
        livereload: true
    });
});

// twprzy katalog z projektem demo
gulp.task('demo', function () {

});

// html
gulp.task('html', function () {
    return gulp.src('app/**/*.html')
        .pipe(connect.reload());
});

// usemin
gulp.task('usemin', function () {
    gulp.src('app/**/*.html')
        .pipe(usemin())
        .pipe(gulp.dest('./dist/'));
});

// czysci katalog z buildem
gulp.task('build-clean', function () {
    return gulp.src('dist/')
        .pipe(clean({force: true}));
});

// upiększa htmla
gulp.task('build-html', function () {
    gulp.src('app/**/*.html')
        .pipe(prettify({
            indent_size: 3,
            indent_character: ' ',
            indent_inner_html: true,
            end_with_newline: true,
            brace_style: 'expand',
            preserve_newlines: true,
            max_preserve_newlines: 2,
            unformatted: ['pre', 'span']
        }))
        .pipe(gulp.dest('dist'))
});

// Optimize Images
gulp.task('build-images', function () {
    return gulp.src('app/images/**/*')
        .pipe(imagemin({
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest('dist/images'))
        .pipe(size({title: 'images'}));
});

// kopoiuje co potrzeba
gulp.task('copy', function () {
    var filesToMove = [
        'app/fonts/**/*.*',
        //'app/images/**/*.*',
        'app/scripts/**/*.*',
        'app/icons/**/*.*',
        'app/*.ico'
    ];

    return gulp.src(filesToMove, { base: 'app/' })
        .pipe(gulp.dest('dist'));
});

// skrypty
gulp.task('scripts', function () {

});

gulp.task('watch', function () {
    gulp.watch([ 'app/styles/**/*.scss'], ['sass']);
    gulp.watch([ 'app/scripts/**/*.js'], ['scripts']);
    gulp.watch([ 'app/**/*.html'], ['html']);
});

// sass
gulp.task('sass', function () {
    return gulp.src('app/styles/**/*.scss')
        .pipe(sass({
            onError: function (error) {
                gutil.log(gutil.colors.red(error));
                gutil.beep();
            },
            onSuccess: function () {
                gutil.log(gutil.colors.green('Sass styles compiled successfully.'));
            }
        }))
        .pipe(autoprefixer(AUTOPREFIXER_BROWSERS))
        .pipe(gulp.dest('.tmp/styles'))
        .pipe(gulp.dest('dist/styles'))
        .pipe(connect.reload());
});

//gulp.task('build', ['clean', 'sass', 'scripts', 'usemin', 'copy'], function () {
//});

gulp.task('build', function(callback){
    runSequence(
        'build-clean',
        'sass',
        'scripts',
        'copy',
        'build-html',
        'build-images',
        callback
    );
});

gulp.task('serve', ['connect', 'sass', 'scripts', 'watch']);