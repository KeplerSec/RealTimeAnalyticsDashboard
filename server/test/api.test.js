const addon = require('../build/Release/analyticsAddon');

describe('Analytics Addon', () => {
  test('should compute average correctly', () => {
    const result = addon.computeAverage([100, 200, 300]);
    expect(result).toBe(200);
  });
});