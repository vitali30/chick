const gulp = require('gulp');
const pug = require('gulp-pug');
const cssimport = require("gulp-cssimport");
const rename = require("gulp-rename");
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
let uglify = require('gulp-uglify-es').default;

// ---------------------------PUG-----------------------------------
gulp.task('pug:compile', function() {
    return gulp.src('src/pug/index.pug')
        // .pipe(pug({pretty: true}))
        .pipe(gulp.dest('public/full'))  
})
gulp.task('pug:mini', function() {
    return gulp.src('src/pug/index.pug')
        // .pipe(pug())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('public/min'))
})
// ----------------------------CSS------------------------------------
gulp.task('css:compile', function() {
    return gulp.src("src/css/index.css")
        .pipe(cssimport())
        .pipe(gulp.dest("public/full"))
}); 
gulp.task('css:min', function() {
    return gulp.src("src/css/index.css")
      .pipe(cssimport())
      .pipe(cleanCSS({compatibility: 'ie8'}))
      .pipe(rename({suffix: '.min'}))
      .pipe(gulp.dest('public/min'));
  });
// ------------------------------------JS------------------------------
const sources = [
    'src/js/utils/*.js',
    'src/js/app/*.js',
    'src/js/index.js'
];
gulp.task('js:min', function() {
    return gulp.src(sources)
        .pipe(concat('index.js'))
        .pipe(uglify(/* options */))
        .pipe(gulp.dest('public/min')) 
})
gulp.task('js:compile', function() {
    return gulp.src(sources)
        .pipe(concat('index.js'))
        .pipe(gulp.dest('public/full'))
})
// -----------------------------------IMG------------------------------
gulp.task('image', function() {
    return gulp.src('src/img/**/*')
        .pipe(gulp.dest('public/full/img'))
})
// -------------------------------------WATCH------------------------------
gulp.task('watch', function() {
    gulp.watch('src/pug/**/*.pug', gulp.parallel('pug:compile', 'pug:mini'));
    gulp.watch('src/css/**/*.css', gulp.parallel('css:compile', 'css:min'));
    gulp.watch('src/js/**/*.js', gulp.parallel('js:min', 'js:compile'));
    gulp.watch('src/img/**/*.**', gulp.parallel('image'));
});


gulp.task('compile', gulp.parallel(
    'pug:compile',
    'pug:mini',
    'css:compile',
    'css:min',
    'js:compile',
    'js:min', 
    'image',
    'watch'

))














