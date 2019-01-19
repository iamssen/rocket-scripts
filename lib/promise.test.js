"use strict";
describe('promise', () => {
    it('test promise run', () => {
        function getTimer(name, delay) {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve(name);
                    console.log('promise.test.ts..()', name);
                }, delay);
            });
        }
        return Promise.all([
            getTimer(0, 100),
            getTimer(1, 400),
            getTimer(2, 1000),
            getTimer(3, 200),
            getTimer(4, 10),
        ]);
    });
});
//# sourceMappingURL=promise.test.js.map