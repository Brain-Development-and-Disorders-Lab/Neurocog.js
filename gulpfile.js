// Gulp modules
const gulp = require('gulp');
const eslint = require('gulp-eslint');
const jsdoc = require('gulp-jsdoc3');
const zip = require('gulp-zip');

// Other modules
const del = require('del');

/**
 * Run the style checker
 * @param {function} cb callback function
 */
function style(cb) {
  gulp.src(['**/*.ts', '**/*.js', '!node_modules/**'])
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
  del(['built', 'docs', 'bundle.zip']);
  cb();
}

/**
 * Generate documentation for the tasks
 * @param {function} cb callback function
 */
function docs(cb) {
  const config = require('./jsdocconfig.json');
  gulp.src([
    'README.md',
    'src/**/*.ts',
  ], {read: false})
      .pipe(jsdoc(config, cb));
}

/**
 * Generate a compressed archive of the 'built/'
 * sub-directory.
 * @param {function} cb callback function
 */
function package(cb) {
  gulp.src('built/*')
      .pipe(zip('bundle.zip'))
      .pipe(gulp.dest('./'));
  cb();
}

exports.build = build;
exports.clean = clean;
exports.docs = docs;
exports.style = style;
exports.package = package;
exports.default = style;
