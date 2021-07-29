const gulp = require('gulp');
const eslint = require('gulp-eslint');
const del = require('del');

/**
 * Run the style checker
 * @param {function} cb callback function
 */
function style(cb) {
  gulp.src(['src/*.ts', '!node_modules/**', '!dist/**'])
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
  del(['dist', 'docs', '.cache', '.parcel-cache', 'built']);
  cb();
}

exports.clean = clean;
exports.style = style;
exports.default = style;
