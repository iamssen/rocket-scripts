"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sortPackageJsonFiles_1 = __importDefault(require("./sortPackageJsonFiles"));
describe('sortPackageJsonFiles', () => {
    it('Should be sorted modules by their dependencies', () => {
        const jsonFiles = [
            {
                name: 'a',
                dependencies: {
                    'c': '0.0.0',
                },
            },
            {
                name: 'b',
                dependencies: {
                    'a': '0.0.0',
                    'c': '0.0.0',
                },
            },
            {
                name: 'c',
            },
            {
                name: 'd',
                dependencies: {
                    'e': '0.0.0',
                    'b': '0.0.0',
                },
            },
            {
                name: 'e',
            },
        ];
        const sorted = sortPackageJsonFiles_1.default(jsonFiles).reverse();
        sorted.forEach((a, i) => {
            for (const b of sorted.slice(0, i)) {
                const aFile = jsonFiles.find(jsonFile => jsonFile.name === a);
                expect(aFile).not.toBeUndefined();
                if (aFile) {
                    expect(!aFile.dependencies || !aFile.dependencies[b]).toBeTruthy();
                }
            }
        });
    });
});
//# sourceMappingURL=sortPackageJsonFiles.test.js.map