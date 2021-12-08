// Gulp modules
const gulp = require('gulp');
const eslint = require('gulp-eslint');
const zip = require('gulp-zip');

// Other modules
const del = require('del');

/**
 * Run the style checker
 * @param {function} cb callback function
 */
function style(cb) {
  gulp.src(['src/**/*.ts', 'src/**/*.js', '!node_modules/**'])
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(eslint.failAfterError());
  cb();
}

/**
 * Clean up build artefacts
 * @param {function} cb callback function
 */
function clean(cb) {
  del([
    'built',
    'docs',
    'bundle.zip',
    'dist',
    '.parcel-cache',
  ]);
  cb();
}

/**
 * Generate a compressed archive of the 'built/'
 * sub-directory.
 * @param {function} cb callback function
 */
function package(cb) {
  gulp.src('dist/*')
      .pipe(zip('bundle.zip'))
      .pipe(gulp.dest('./'));
  cb();
}

exports.clean = clean;
exports.style = style;
exports.package = package;
exports.default = style;
