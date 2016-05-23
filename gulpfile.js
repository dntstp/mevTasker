var gulp         = require('gulp'),
		sass         = require('gulp-sass'),
		autoprefixer = require('gulp-autoprefixer'),
		cleanCSS    = require('gulp-clean-css'),
		rename       = require('gulp-rename'),
		browserSync  = require('browser-sync').create(),
		concat       = require('gulp-concat'),
		uglify       = require('gulp-uglify');

gulp.task('browser-sync', ['styles', 'scripts'], function() {
		browserSync.init({
				server: {
						baseDir: "./app"
				},
				notify: false
		});
});

gulp.task('styles', function () {
	return gulp.src(
		[
		'libs/bootstrap/dist/css/bootstrap.css',
		'libs/animate.css/animate.min.css',
		'libs/font-awesome/css/font-awesome.min.css',
		'libs/angular-bootstrap-datetimepicker/src/css/datetimepicker.css',
		'css/*.css',
		'sass/*.sass'

		])
	.pipe(sass({
		includePaths: require('node-bourbon').includePaths
	}).on('error', sass.logError))
	.pipe(rename({suffix: '.min', prefix : ''}))
	.pipe(autoprefixer({browsers: ['last 15 versions'], cascade: false}))
	.pipe(cleanCSS())
	.pipe(concat('app.css'))
	.pipe(gulp.dest('./app/css/'))
	.pipe(browserSync.stream());
});

gulp.task('scripts', function() {
	return gulp.src([
		'libs/modernizr/modernizr.js',
		'libs/animate/animate-css.js',
		'libs/moment/min/moment.min.js',
		'libs/jquery/dist/jquery.min.js',
		'libs/bootstrap/dist/js/bootstrap.min.js',
		'libs/angular/angular.min.js',
		'libs/angular-route/angular-route.min.js',
		'libs/angular-cookies/angular-cookies.min.js',
		'libs/angular-animate/angular-animate.min.js',
		'libs/angular-touch/angular-touch.min.js',
		'libs/angularLocalStorage/src/angularLocalStorage.js',
		'libs/angular-slugify/angular-slugify.js',
		'libs/angular-moment/angular-moment.js',
		'libs/angular-bootstrap-datetimepicker/src/js/datetimepicker.js',
		'libs/angular-bootstrap-datetimepicker/src/js/datetimepicker.templates.js',
		'libs/ngDraggable/ngDraggable.js'

		])
		.pipe(concat('libs.js'))
		.pipe(uglify()) //Minify libs.js
		.pipe(gulp.dest('./app/js/'));
});

gulp.task('watch', function () {
	gulp.watch('sass/*.sass', ['styles']);
	gulp.watch('css/*.css', ['styles']);
	gulp.watch('libs/**/*.js', ['scripts']);
	gulp.watch('app/js/*.js').on("change", browserSync.reload);
	gulp.watch('app/*.html').on('change', browserSync.reload);
});

gulp.task('default', ['browser-sync', 'watch']);