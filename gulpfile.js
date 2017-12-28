var gulp 		= require('gulp'),
	less 		= require('gulp-less'),
	browserSync = require('browser-sync'),
	smartGrid   = require('smart-grid'),
	gcmq        = require('gulp-group-css-media-queries'),
	del         = require('del'),
	imagemin    = require('gulp-imagemin'),
	pngquant    = require('imagemin-pngquant'),
	cache       = require('gulp-cache'),
	autoprefixer = require('gulp-autoprefixer');
	
	/* It's principal settings in smart grid project */
var settings = {
    outputStyle: 'less', /* less || scss || sass || styl */
    columns: 12, /* number of grid columns */
    offset: '30px', /* gutter width px || % */
    container: {
        maxWidth: '1200px', /* max-width оn very large screen */
        fields: '30px' /* side fields */
    },
    breakPoints: {
        lg: {
            width: '1100px', /* -> @media (max-width: 1100px) */
            fields: '30px' /* side fields */
        },
        md: {
            width: '960px',
            fields: '15px'
        },
        sm: {
            width: '780px',
            fields: '15px'
        },
        xs: {
            width: '560px',
            fields: '15px'
        }
        /* 
        We can create any quantity of break points.

        some_name: {
            some_width: 'Npx',
            some_offset: 'N(px|%)'
        }
        */
    }
};

gulp.task('smart-grid', function(){
	smartGrid('app/less', settings);
});


gulp.task('less', function(){
	return gulp.src(["!app/less/smart-grid.less", "app/less/**/*.less"])
				.pipe( less().on('error', function(error){ console.log(error); }) )
				//.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true} ) )
				.pipe( gulp.dest("app/css") )
				.pipe(browserSync.reload( {stream: true} ) );
});

gulp.task('group', function(){
	gulp.src('app/css/main_admin.css')
			.pipe( gcmq() )
			.pipe( gulp.dest('app/css') );
});

gulp.task("browser-sync", function(){
	browserSync({
		server: {
			baseDir: "app/"
		},
		notify: false
	});
});

gulp.task('img', function(){
	return gulp.src('app/img/**/*')
			.pipe( cache( imagtmin({
				interlaced: true,
				progressive: true,
				svgoPlugins: [{removeViewBox: false}],
				une: [pngquant()]
			}) ) )
			.pipe(gulp.dest('dist/img'));
});



gulp.task('clean', function(){
	return del.sync('dist');
});

gulp.task('clear', function(){
	return cache.clearAll();
});

gulp.task("watch", ["browser-sync", "less"], function(){
	gulp.watch("app/less/**/*.less",['less']);
	gulp.watch("app/*.html", browserSync.reload);
	gulp.watch("app/js/**/*.js", browserSync.reload);
});

gulp.task('build', ['clean'], function(){
	var buildCss = gulp.src('app/css/main_admin.css')
		.pipe( gulp.dest('dist/css') );
	var buildFonts = gulp.src('app/fonts/**/*')
		.pipe( gulp.dest('dist/fonts') );
	var buildJs = gulp.src('app/js/**/*')
		.pipe( gulp.dest('dist/js') );
	var buildHtml = gulp.src('app/*.html')
		.pipe( gulp.dest('dist') );
});