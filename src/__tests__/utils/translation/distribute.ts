import { TranslationContent, TranslationNode } from '../../../types';

const sampleData: TranslationContent = {
  a: {
    b: {
      c: {
        d: 'hello',
      },
    },
  },
};

const keys: string[] = ['a', 'b', 'c', 'd'];

describe('translation/distribute', () => {
  it('Should get the value by getValue()', () => {
    const v: TranslationNode = keys.reduce((data: TranslationContent, k: string) => data[k], sampleData);
    
    expect(v).toEqual('hello');
  });
  
  it('Should set the value by setValue()', () => {
    const c: TranslationNode = keys.slice(0, keys.length - 1).reduce((data: TranslationContent, k: string) => data[k], sampleData);
    
    c['d'] = 'fuck';
    
    const v: TranslationNode = keys.reduce((data: TranslationContent, k: string) => data[k], sampleData);
    
    expect(v).toEqual('fuck');
  });
});