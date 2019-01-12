"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flattenTranslationToIntl_1 = require("./flattenTranslationToIntl");
const sampleData = {
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
        expect(flattenTranslationToIntl_1.flattenTranslationToIntl(sampleData)).toEqual({
            'a.b.c': 'abc',
            'a.b.d': 'abd',
            'a.e.f': 'aef',
            'a.g': 'ag',
            'x.y': 'xy',
            'x.z': 'xz',
        });
    });
});
//# sourceMappingURL=flattenTranslationToIntl.test.js.map