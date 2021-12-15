module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  ignorePatterns: [
    '.eslintrc.js',
    'jest.config.js',
    'webpack.config.js',
    'gulpfile.js',
    'example/',
    'built/',
    'dist/',
    '__mocks__',
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
