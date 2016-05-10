'use strict';

const browserify = require('browserify');
const watchify = require('watchify');
const gulp = require('gulp');
const gutil = require('gulp-util');
const sourcemaps = require('gulp-sourcemaps');
const react = require('gulp-react');
const browserSync = require('browser-sync').create();
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');

var b = browserify({
  entries: ['client/js/app.js'],
  debug: true,
  transform: [['babelify', {presets: ["es2015", "react", "stage-1"]}]]
}, watchify.args);

function bundle(){
  return b.bundle()
    .on('error', function(err){
      if (err && err.codeFrame) {
        gutil.log(
          gutil.colors.red("Browserify error: "),
          gutil.colors.cyan(err.filename) + ` [${err.loc.line},${err.loc.column}]`,
          "\r\n" + err.message + "\r\n" + err.codeFrame);
      }
      else {
        gutil.log(err);
      }
      this.emit("end");

    })
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./app/js'))
    .pipe(browserSync.stream());
}

if (process.argv.length <= 2 || process.argv[2] == 'live'){
  b = watchify(b);
  b.on('update', bundle);
}

gulp.task('js', bundle);

gulp.task('config', function(){
  return gulp.src('./client/config.js')
    .pipe(gulp.dest('./app/'))
    .pipe(browserSync.stream());
});

gulp.task('html', function(){
  return gulp.src('./client/index.html')
    .pipe(gulp.dest('./app/'))
    .pipe(browserSync.stream()); 
});

gulp.task('electron_package', function(){
  return gulp.src(['./electron/package.json'], {base:"./electron"})
    .pipe(gulp.dest('./app'));
})
gulp.task('build_electron', ['electron_package', 'build_web'], function(){
  return gulp.src(['./electron/*.js', './server/**/*'], {base:'./'})
    .pipe(gulp.dest('./app/'));
})

gulp.task('build_web', ['js', 'html', 'config']);

gulp.task('start_web', ['build_web'], function(){
  browserSync.init({
    server: {
      baseDir: "./app"
    }
  });
  gulp.watch("client/**/*.html", ['html']);
  gulp.watch("client/config.js", ['config']);
});
