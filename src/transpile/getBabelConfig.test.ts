import { getBabelConfig } from './getBabelConfig';

describe('getBabelConfig()', () => {
  test('get config correctly', () => {
    expect(Object.keys(getBabelConfig({modules: 'commonjs'}))).toEqual(['presets', 'plugins', 'overrides']);
  });
});