var gulp = require('gulp');
var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');
var minifyHtml = require('gulp-minify-html');
var minifyCss = require('gulp-minify-css');
var rev = require('gulp-rev');

gulp.task('weplay_index', function () {
    return gulp.src('./weplay/index.html')
        .pipe(usemin({
            css: [minifyCss(), 'concat'],
            html: [minifyHtml({empty: true})],
            js: [uglify(), rev()],
            js1: [uglify(), rev()]
        }))
        .pipe(gulp.dest('./release/weplay/'));
});

gulp.task('weplay_static', function () {
    return gulp.src(['./weplay/**/*','!./weplay/**/*.js','!./weplay/**/*.html','!./weplay/**/*.less','!./weplay/**/*.css'])
        .pipe(gulp.dest('./release/weplay/'));
});

gulp.task('weplay', [], function() {
    gulp.start('weplay_index','weplay_static');
});


gulp.task('default', [], function() {
    gulp.start('weplay');
});