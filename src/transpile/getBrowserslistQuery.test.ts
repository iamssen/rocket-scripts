import { createTmpMockup } from '../utils/createTmpMockup';
import { getBrowserslistQuery } from './getBrowserslistQuery';

describe('getBrowserslistQuery', () => {
  test('Basic', async () => {
    const cwd: string = await createTmpMockup('basic');
    
    process.env.BROWSERSLIST_ENV = 'production';
    expect(getBrowserslistQuery({cwd})).toEqual([
      '>0.2%',
      'not dead',
      'not op_mini all',
    ]);
    
    process.env.BROWSERSLIST_ENV = 'development';
    expect(getBrowserslistQuery({cwd})).toEqual([
      'last 1 chrome version',
      'last 1 firefox version',
      'last 1 safari version',
    ]);
    
    process.env.BROWSERSLIST_ENV = 'server';
    expect(getBrowserslistQuery({cwd})).toEqual('node 10');
    
    process.env.BROWSERSLIST_ENV = 'server_development';
    expect(getBrowserslistQuery({cwd})).toEqual('current node');
    
    process.env.BROWSERSLIST_ENV = 'package';
    expect(getBrowserslistQuery({cwd})).toEqual([
      '>0.2%',
      'not dead',
      'not op_mini all',
    ]);
    
    process.env.BROWSERSLIST_ENV = 'test';
    expect(getBrowserslistQuery({cwd})).toEqual('current node');
  });
});