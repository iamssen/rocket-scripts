"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const intlToTree_1 = require("../../../utils/translation/intlToTree");
const sampleData = {
    'en-US': {
        'a.b.c': 'abc',
        'a.b.d': 'abd',
        'a.e.f': 'aef',
        'a.g': 'ag',
        'x.y': 'xy',
        'x.z': 'xz',
    },
};
describe('translation/intlToTree', () => {
    it('Should be converted intl format to translation format', () => {
        expect(intlToTree_1.intlToTree(sampleData)).toEqual({
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
//# sourceMappingURL=intlToTree.js.map