var gulp = require('gulp');
var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');
var minifyHtml = require('gulp-minify-html');
var minifyCss = require('gulp-minify-css');
var rev = require('gulp-rev');

gulp.task('nanyuan_1_1', function () {
    return gulp.src('./nanyuan/1.1nanyuandongtai.html')
        .pipe(usemin({
            css: [minifyCss(), 'concat'],
            html: [minifyHtml({empty: true})],
            js: [uglify(), rev()],
            js1: [uglify(), rev()],
            js2: [uglify(), rev()]
        }))
        .pipe(gulp.dest('./release/nanyuan/'));
});

gulp.task('nanyuan_1_2', function () {
    return gulp.src('./nanyuan/1.2minshengshishi.html')
        .pipe(usemin({
            css: [minifyCss(), 'concat'],
            html: [minifyHtml({empty: true})],
            js: [uglify(), rev()],
            js1: [uglify(), rev()],
            js2: [uglify(), rev()]
        }))
        .pipe(gulp.dest('./release/nanyuan/'));
});

gulp.task('nanyuan_1_3', function () {
    return gulp.src('./nanyuan/1.3tongzhigonggao.html')
        .pipe(usemin({
            css: [minifyCss(), 'concat'],
            html: [minifyHtml({empty: true})],
            js: [uglify(), rev()],
            js1: [uglify(), rev()],
            js2: [uglify(), rev()]
        }))
        .pipe(gulp.dest('./release/nanyuan/'));
});

gulp.task('nanyuan_2_1', function () {
    return gulp.src('./nanyuan/2.1minyizhengji.html')
        .pipe(usemin({
            css: [minifyCss(), 'concat'],
            html: [minifyHtml({empty: true})],
            js: [uglify(), rev()],
            js1: [uglify(), rev()],
            js2: [uglify(), rev()]
        }))
        .pipe(gulp.dest('./release/nanyuan/'));
});

gulp.task('nanyuan_2_2', function () {
    return gulp.src('./nanyuan/2.2zixuntousu.html')
        .pipe(usemin({
            css: [minifyCss(), 'concat'],
            html: [minifyHtml({empty: true})],
            js: [uglify(), rev()],
            js1: [uglify(), rev()],
            js2: [uglify(), rev()]
        }))
        .pipe(gulp.dest('./release/nanyuan/'));
});

gulp.task('nanyuan_2_3', function () {
    return gulp.src('./nanyuan/2.3suishoupai.html')
        .pipe(usemin({
            css: [minifyCss(), 'concat'],
            html: [minifyHtml({empty: true})],
            js: [uglify(), rev()],
            js1: [uglify(), rev()],
            js2: [uglify(), rev()]
        }))
        .pipe(gulp.dest('./release/nanyuan/'));
});

gulp.task('nanyuan_2_4', function () {
    return gulp.src('./nanyuan/2.4wenjuandiaocha.html')
        .pipe(usemin({
            css: [minifyCss(), 'concat'],
            html: [minifyHtml({empty: true})],
            js: [uglify(), rev()],
            js1: [uglify(), rev()],
            js2: [uglify(), rev()]
        }))
        .pipe(gulp.dest('./release/nanyuan/'));
});

gulp.task('nanyuan_3_1', function () {
    return gulp.src('./nanyuan/3.1zhengwuzhinan.html')
        .pipe(usemin({
            css: [minifyCss(), 'concat'],
            html: [minifyHtml({empty: true})],
            js: [uglify(), rev()],
            js1: [uglify(), rev()],
            js2: [uglify(), rev()]
        }))
        .pipe(gulp.dest('./release/nanyuan/'));
});

gulp.task('nanyuan_3_2', function () {
    return gulp.src('./nanyuan/3.2yuyuebanshi.html')
        .pipe(usemin({
            css: [minifyCss(), 'concat'],
            html: [minifyHtml({empty: true})],
            js: [uglify(), rev()],
            js1: [uglify(), rev()],
            js2: [uglify(), rev()]
        }))
        .pipe(gulp.dest('./release/nanyuan/'));
});

gulp.task('nanyuan_3_3', function () {
    return gulp.src('./nanyuan/3.3jieguochaxun.html')
        .pipe(usemin({
            css: [minifyCss(), 'concat'],
            html: [minifyHtml({empty: true})],
            js: [uglify(), rev()],
            js1: [uglify(), rev()],
            js2: [uglify(), rev()]
        }))
        .pipe(gulp.dest('./release/nanyuan/'));
});


gulp.task('nanyuan_3_4', function () {
    return gulp.src('./nanyuan/3.5lianxiwomen.html')
        .pipe(usemin({
            css: [minifyCss(), 'concat'],
            html: [minifyHtml({empty: true})],
            js: [uglify(), rev()],
            js1: [uglify(), rev()],
            js2: [uglify(), rev()]
        }))
        .pipe(gulp.dest('./release/nanyuan/'));
});

gulp.task('nanyuan_accessRight', function () {
    return gulp.src('./nanyuan/accessRight.html')
        .pipe(usemin({
            css: [minifyCss(), 'concat'],
            html: [minifyHtml({empty: true})],
            js: [uglify(), rev()],
            js1: [uglify(), rev()],
            js2: [uglify(), rev()]
        }))
        .pipe(gulp.dest('./release/nanyuan/'));
});

gulp.task('nanyuan_register', function () {
    return gulp.src('./nanyuan/register.html')
        .pipe(usemin({
            css: [minifyCss(), 'concat'],
            html: [minifyHtml({empty: true})],
            js: [uglify(), rev()],
            js1: [uglify(), rev()],
            js2: [uglify(), rev()]
        }))
        .pipe(gulp.dest('./release/nanyuan/'));
});

gulp.task('nanyuan_static', function () {
    return gulp.src(['./nanyuan/**/*','!./nanyuan/*.html'])
        .pipe(gulp.dest('./release/nanyuan/'));
});

gulp.task('nanyuan', [], function() {
    //gulp.start('app_crm_index','app_crm_register','app_crm_verifierRegister','app_crm_verify','app_crm_static');
    gulp.start('nanyuan_1_1','nanyuan_1_2','nanyuan_1_3','nanyuan_2_1','nanyuan_2_2','nanyuan_2_3','nanyuan_2_4','nanyuan_3_1','nanyuan_3_2','nanyuan_3_3','nanyuan_3_4','nanyuan_accessRight','nanyuan_register','nanyuan_static');
});

gulp.task('default', [], function() {
    gulp.start('nanyuan');
});