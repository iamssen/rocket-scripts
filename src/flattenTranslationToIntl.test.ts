import { flattenTranslationToIntl } from './flattenTranslationToIntl';
import { TranslationContent } from './types';

const sampleData: TranslationContent = {
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
};

describe('flattenTranslationToIntl', () => {
  it('Should be converted tree to intl format', () => {
    expect(flattenTranslationToIntl(sampleData)).toEqual({
      'a.b.c': 'abc',
      'a.b.d': 'abd',
      'a.e.f': 'aef',
      'a.g': 'ag',
      'x.y': 'xy',
      'x.z': 'xz',
    });
  });
});