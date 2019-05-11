import { createTmpMockup } from '../utils/createTmpMockup';
import { getBabelConfig } from './getBabelConfig';

describe('getBabelConfig()', () => {
  test('get config correctly', async () => {
    const cwd: string = await createTmpMockup('basic');
    const config: object = getBabelConfig({cwd, modules: 'commonjs'});
    expect(Object.keys(config)).toEqual(['presets', 'plugins', 'overrides']);
    expect(config['presets'][0][1]['modules']).toEqual('commonjs');
    
    expect(getBabelConfig({cwd, modules: false})['presets'][0][1]['modules']).toEqual(false);
  });
});