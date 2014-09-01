// Util
var gulp =require('gulp');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var connect = require('gulp-connect');
var minifyCss = require('gulp-minify-css');
var uglify = require('gulp-uglify');

// Plugins
var compass = require('gulp-compass');
var browserify = require('gulp-browserify');
var jade = require('gulp-jade');
var imagemin = require('gulp-imagemin');
var annotate = require('gulp-ng-annotate')

var p = {
  sass: {
    src:'src/public/sass/main.scss',
    dest:'public/style/'
  },
  scripts: {
    coffee: 'src/public/scripts/main.coffee',
    js: 'src/public/scripts/main.js',
    dest: 'public/scripts/'
  },
  jade: {
    src: 'src/jade/*.jade',
    dest: '' 
  }
}

p.scripts.src = p.scripts.coffee;

// Livereload
gulp.task('connect', function() {
  connect.server({
    root:'./',
    livereload: true,
    port: 8000
  })
})

// Compass
gulp.task('compass', function() {
  gulp.src(p.sass.src)
    .pipe(compass({
      css: 'public/style',
      sass: 'src/public/sass', 
      require: ['susy', 'breakpoint', 'modular-scale'],
      sourcemap: true
    }))
    .on('error', function(err) {
      console.log(err) // plumber was not very good with compass
    })
    .pipe(minifyCss())
    .pipe(gulp.dest(p.sass.dest))
    .pipe(connect.reload())
}) 

// Coffee
gulp.task('browserify', function() {
  
    gulp.src(p.scripts.src, {read: false})  
    .pipe(plumber())
    .pipe(browserify({
      transform: ['coffeeify'],
      extensions: ['.coffee']
      
    }))
    .pipe(rename('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest(p.scripts.dest))
    .pipe(connect.reload())
})

// Jade
gulp.task('jade', function() {
  gulp.src(p.jade.src)
    .pipe(plumber())
    .pipe(jade())
    .pipe(gulp.dest(p.jade.dest))
    .pipe(connect.reload())
})

// Images
gulp.task('images', function() {
  gulp.src('src/public/images/**/*')
    .pipe(plumber())
    .pipe(imagemin())
    .pipe(gulp.dest('public/images/'))
    .pipe(connect.reload())
})

// Watch
gulp.task('watch', function() {
  gulp.watch('src/public/sass/**/*.scss', ['compass']);
  gulp.watch('src/jade/**/*.jade', ['jade']);
  gulp.watch('src/public/scripts/**/*', ['browserify']);
  gulp.watch('src/public/images/**',['images']);
})

// Go
gulp.task('default', ['connect','jade', 'compass', 'browserify', 'images', 'watch'], function() {
  console.log('Starting gulp!')
})
