module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  ignorePatterns: [
    '.eslintrc.js',
    'webpack.config.js',
    'gulpfile.js',
    'example/',
    'built/',
    'dist/',
  ],
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'google',
  ],
};
