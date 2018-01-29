var config = {
	src: {
		root: 'src/',
		sass: 'src/sass/',
		html: 'src/templates/',
		js: 'src/js/',
		img: 'src/img/'
	},
	dest: {
		root: 'docs/',
		css: 'docs/css/',
		js: 'docs/js/',
		img: 'docs/img'
	}
};

// import modules
var gulp         = require('gulp'),
	scss         = require('gulp-sass'),
	browserSync  = require('browser-sync'),
	uglify       = require('gulp-uglifyjs'),
	cssnano      = require('gulp-cssnano'),
	rename       = require('gulp-rename'),
	del          = require('del'),
	imagemin     = require('gulp-imagemin'),
	pngquant     = require('imagemin-pngquant'),
	autoprefixer = require('gulp-autoprefixer'),
	nunjucks	 = require('gulp-nunjucks');


gulp.task('nunjucks', function () {
	return gulp.src(config.src.html + '**/*.html')
		.pipe(nunjucks.compile())
		.pipe(gulp.dest(config.dest.root))
		.pipe(browserSync.reload({ stream: true }))
});

gulp.task('scss', ['nunjucks'], function() {
	return gulp.src(config.src.sass + '**/*.scss')
	.pipe(scss().on( 'error', function( error )
      {console.log( error );} )
	)
	.pipe(autoprefixer(['last 2 versions'], {cascade:true}))
	.pipe(gulp.dest(config.dest.css))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('css-min', ['scss'], function(){
	return gulp.src(config.dest.css + '*.css')
	.pipe(cssnano())
	.pipe(rename({suffix: '.min'})) 
	.pipe(gulp.dest(config.dest.css));
});

gulp.task('img', function(){
	return gulp.src(config.src.img + '/**/*')
	.pipe(imagemin({
		interlaced: true,
		progressive: true,
		svgoPlugins: [{removeViewBox: false}],
		use: [pngquant()]
	}))
	.pipe(gulp.dest(config.dest.img));
});

gulp.task('browser-sync', ['scss'], function(){
	browserSync({
		server: {
			baseDir: config.dest.root
		},
		notify: false
	});
});

gulp.task('clean', function(){
	return del.sync(config.dest.root);
});

gulp.task('default', ['browser-sync', 'nunjucks', 'scss'], function() {
	gulp.watch(config.src.sass + '**/*.scss', ['scss']);
	gulp.watch(config.src.html + '*.html', ['nunjucks', browserSync.reload]);
});

gulp.task('build', ['clean', 'nunjucks', 'scss', 'img', 'css-min'], function() {
	return
});