"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const toIntl_1 = require("../../../utils/translation/toIntl");
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
describe('translation/toIntl', () => {
    it('Should be converted tree to intl format', () => {
        expect(toIntl_1.toIntl(sampleData)).toEqual({
            'a.b.c': 'abc',
            'a.b.d': 'abd',
            'a.e.f': 'aef',
            'a.g': 'ag',
            'x.y': 'xy',
            'x.z': 'xz',
        });
    });
});
//# sourceMappingURL=toIntl.js.map