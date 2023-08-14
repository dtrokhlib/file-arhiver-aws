module.exports = {
  verbose: true,
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: [
    "**/src/**",
    "!**/src/interfaces/**",
    "!**/coverage/**",
    "!**/test/**",
    "!**/node_modules/**",
  ],
  transform: {
    ".(ts|tsx)": "ts-jest"
  },
  moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json", "node"],
  clearMocks: true,
};
