module.exports = {
  // Take existing Jest configuration
  ...require("@jspsych/config/jest").makePackageConfig(__dirname),

  // Include the mocked instance of "d3-random"
  moduleNameMapper: {
    "d3-random": "<rootDir>/test/mocks/d3-random-mock.js"
  },
};
