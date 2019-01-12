import { intlFormatToTranslation } from './intlFormatToTranslation';

const sampleData: object = {
  'en-US': {
    'a.b.c': 'abc',
    'a.b.d': 'abd',
    'a.e.f': 'aef',
    'a.g': 'ag',
    'x.y': 'xy',
    'x.z': 'xz',
  },
};

describe('intlFormatToTranslation', () => {
  it('Should be converted intl format to translation format', () => {
    expect(intlFormatToTranslation(sampleData)).toEqual({
      'en-US': {
        a: {
          b: {
            c: 'abc',
            d: 'abd',
          },
          e: {
            f: 'aef',
          },
          g: 'ag',
        },
        x: {
          y: 'xy',
          z: 'xz',
        },
      },
    });
  });
});