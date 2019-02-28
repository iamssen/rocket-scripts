"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sampleData = {
    a: {
        b: {
            c: {
                d: 'hello',
            },
        },
    },
};
const keys = ['a', 'b', 'c', 'd'];
describe('translation/distribute', () => {
    it('Should get the value by getValue()', () => {
        const v = keys.reduce((data, k) => data[k], sampleData);
        expect(v).toEqual('hello');
    });
    it('Should set the value by setValue()', () => {
        const c = keys.slice(0, keys.length - 1).reduce((data, k) => data[k], sampleData);
        c['d'] = 'fuck';
        const v = keys.reduce((data, k) => data[k], sampleData);
        expect(v).toEqual('fuck');
    });
});
//# sourceMappingURL=distribute.js.map