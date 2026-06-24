// stryker.conf.js
module.exports = {
  mutate: ['src/**/*.js'],
  testRunner: 'jasmine',
  jasmineConfigFile: 'spec/support/jasmine.json',
  reporters: ['html', 'clear-text', 'progress'],
  coverageAnalysis: 'perTest',
  thresholds: {
    high: 80,
    low: 70,
    break: 60
  },
  timeoutMS: 5000,
  concurrency: 2
};
 