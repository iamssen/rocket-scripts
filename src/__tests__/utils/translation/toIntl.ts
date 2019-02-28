import { TranslationContent } from '../../../types';
import { toIntl } from '../../../utils/translation/toIntl';

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

describe('translation/toIntl', () => {
  it('Should be converted tree to intl format', () => {
    expect(toIntl(sampleData)).toEqual({
      'a.b.c': 'abc',
      'a.b.d': 'abd',
      'a.e.f': 'aef',
      'a.g': 'ag',
      'x.y': 'xy',
      'x.z': 'xz',
    });
  });
});