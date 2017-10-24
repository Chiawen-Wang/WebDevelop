var gulp = require('gulp');
var gzip = require('gulp-gzip');
 
gulp.task('compress', function() {
    gulp.src('js/*.js')
    .pipe(gzip())
    .pipe(gulp.dest('Jscripts'));
});