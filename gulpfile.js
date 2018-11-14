var gulp         = require('gulp'),
    sass         = require('gulp-sass'),
    pug          = require('gulp-pug'),
    browserSync  = require('browser-sync'),
    concat       = require('gulp-concat'),
    uglify       = require('gulp-uglifyjs'),
    cssnano      = require('gulp-cssnano'),
    rename       = require('gulp-rename'),
    cleanCSS     = require('gulp-clean-css'),
    csso         = require('gulp-csso'),
    del          = require('del'),
    cache        = require('gulp-cache'),
    plumber      = require('gulp-plumber'),
    autoprefixer = require('gulp-autoprefixer');

gulp.task('sass', function(){
    return gulp.src('app/sass/*.sass')
      .pipe(plumber())
      .pipe(sass())
      .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
      .pipe(gulp.dest('app/css/'))
      .pipe(browserSync.reload({stream: true}));
  });

gulp.task('pug', function(){
  return gulp.src('app/pug/*.pug')
    .pipe(plumber())
    .pipe(pug({
        pretty: true
    }))
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
    'node_modules/@fancyapps/fancybox/dist/jquery.fancybox.css',
    'node_modules/hamburgers/dist/hamburgers.css',
    'node_modules/jquery.mmenu/dist/jquery.mmenu.all.css',
    'node_modules/nouislider/distribute/nouislider.css',
    'node_modules/jquery-form-styler/dist/jquery.formstyler.css',
    'node_modules/responsive-tabs/css/jquery.responsive-tabs.css',
    'app/vendor/css/preloader.css',
    'node_modules/slick-carousel/slick/slick.css'
  ])
    .pipe(concat('libs.min.css'))
    .pipe(cssnano())
    .pipe(gulp.dest('app/css'))
});

gulp.task('scripts', function(){
  return gulp.src([
      'node_modules/jquery/dist/jquery.min.js',
      'node_modules/@fancyapps/fancybox/dist/jquery.fancybox.js',
      'node_modules/owl.carousel/dist/owl.carousel.js',
      'node_modules/masonry-layout/dist/masonry.pkgd.js',
      'node_modules/jquery.mmenu/dist/jquery.mmenu.all.js',
      'node_modules/nouislider/distribute/nouislider.js',
      'node_modules/jquery-form-styler/dist/jquery.formstyler.js',
      "node_modules/responsive-tabs/js/jquery.responsiveTabs.js",
      'node_modules/slick-carousel/slick/slick.js'
  ])
    .pipe(concat('libs.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('app/js'));
});

gulp.task('clean', function() {
  return del.sync('dist');
});

gulp.task('build', ['clean', 'pug', 'sass', 'scripts'], function() {

  var buildCss = gulp.src('app/css/**/*.css')
    .pipe(csso())
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('dist/css'))

  var buildFonts = gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))

  var buildJs = gulp.src('app/js/**/*')
    .pipe(gulp.dest('dist/js'));

  var buildHtml = gulp.src('app/*.html')
    .pipe(gulp.dest('dist'));

  var buildImg = gulp.src('app/img/**/*')
    .pipe(gulp.dest('dist/img'));
});

gulp.task('clear', function (callback) {
  return cache.clearAll();
})

gulp.task('watch', ['browser-sync', 'pug', 'sass', 'css-libs', 'scripts'], function(){
  gulp.watch('app/sass/**/*.sass', ['sass']);
  gulp.watch('app/pug/**/*.pug', ['pug']);
  gulp.watch('app/js/*.js', browserSync.reload);
});