import { createTmpFixture } from '../utils/createTmpFixture';
import { getBabelConfig } from './getBabelConfig';

describe('getBabelConfig()', () => {
  test('Babel Config 옵션이 정상적으로 반영되는지 확인', async () => {
    const cwd: string = await createTmpFixture('simple-csr-ts');
    
    function check(modules: false | 'commonjs') {
      const config: object = getBabelConfig({cwd, modules});
      expect(Object.keys(config)).toEqual(['presets', 'plugins', 'overrides']);
      expect(config['presets'][0][1]['modules']).toEqual(modules);
    }
    
    check('commonjs');
    check(false);
  });
});