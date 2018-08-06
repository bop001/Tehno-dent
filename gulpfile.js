var gulp         = require('gulp'),
    sass         = require('gulp-sass'),
    pug          = require('gulp-pug'),
    browserSync  = require('browser-sync'),
    concat       = require('gulp-concat'),
    uglify       = require('gulp-uglifyjs'),
    cssnano      = require('gulp-cssnano'),
    rename       = require('gulp-rename'),
    del          = require('del'),
    imagemin     = require('gulp-imagemin'),
    pngquant     = require('imagemin-pngquant'),
    cache        = require('gulp-cache'),
    autoprefixer = require('gulp-autoprefixer');

gulp.task('sass', function(){
    return gulp.src('app/sass/*.sass')
      .pipe(sass())
      .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
      .pipe(gulp.dest('app/css/'))
      .pipe(browserSync.reload({stream: true}));
  });

gulp.task('pug', function(){
  return gulp.src('app/pug/**/*.pug')
    .pipe(pug())
    .pipe(gulp.dest('app'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('browser-sync', function(){
  browserSync({
    server: {
      baseDir: 'app/'
    }
  });
});

gulp.task('css-libs', function(){
  return gulp.src([
    'node_modules/owl.carousel/dist/assets/owl.carousel.css',
    'node_modules/fancybox/dist/css/jquery.fancybox.css',
    'node_modules/hamburgers/dist/hamburgers.css'
  ])
    .pipe(concat('libs.min.css'))
    .pipe(cssnano())
    .pipe(gulp.dest('app/css'))
});

gulp.task('scripts', function(){
  return gulp.src([
      'node_modules/jquery/dist/jquery.min.js',
      'node_modules/fancybox/dist/js/jquery.fancybox.js',
      'node_modules/owl.carousel/dist/owl.carousel.js'
  ])
    .pipe(concat('libs.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('app/js'));
});

gulp.task('clean', function() {
  return del.sync('dist');
});

gulp.task('img', function() {
  return gulp.src('app/img/**/*')
    .pipe(cache(imagemin({
      interlaced: true,
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    })))
    .pipe(gulp.dest('dist/img'));
});

gulp.task('build', ['clean', 'img', 'pug', 'sass', 'scripts'], function() {

  var buildCss = gulp.src('app/css/**/*.css')
    .pipe(gulp.dest('dist/css'))

  var buildFonts = gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))

  var buildJs = gulp.src('app/js/**/*')
    .pipe(gulp.dest('dist/js'));


  var buildHtml = gulp.src('app/*.html')
    .pipe(gulp.dest('dist'));

});

gulp.task('clear', function (callback) {
  return cache.clearAll();
})

gulp.task('watch', ['browser-sync', 'pug', 'sass', 'css-libs', 'scripts'], function(){
  gulp.watch('app/sass/**/*.sass', ['sass']);
  gulp.watch('app/pug/**/*.pug', ['pug']);
  gulp.watch('app/js/*.js', browserSync.reload);
});