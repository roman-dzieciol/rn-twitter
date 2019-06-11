// jest.config.js
module.exports = {
  verbose: true,
  preset: 'react-native',
  setupFiles: ['./.jest/async-storage.js', './.jest/fetch.js'],
  collectCoverage: true,
  collectCoverageFrom: ['app/**/*.{js,jsx}', '!**/node_modules/**', '!**/vendor/**']
};
