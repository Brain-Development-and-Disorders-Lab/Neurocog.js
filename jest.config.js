/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  testEnvironment: 'jsdom',
  preset: 'ts-jest/presets/js-with-ts',
  roots: [
    '<rootDir>/src/',
    '<rootDir>/test/',
  ],
  // Specify mocks
  moduleNameMapper: {
    '\\.(css|less)$': '<rootDir>/test/__mocks__/styles.js',
  },
  // Setup transform ignores
  transformIgnorePatterns: [
    // d3-random
    '/node_modules/(?!(d3-random)/)',
  ]
};
