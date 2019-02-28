"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const mock_fs_1 = __importDefault(require("mock-fs"));
const path_1 = __importDefault(require("path"));
const build_1 = __importDefault(require("../../../utils/template/build"));
describe('template/build', () => {
    afterEach(() => {
        mock_fs_1.default.restore();
    });
    it('Should be created html files', () => {
        const templateDirectory = 'src/_templates';
        const outputPath = 'public';
        const files = ['index', 'showcase', '200'];
        mock_fs_1.default({
            [templateDirectory]: {
                'index.ejs': `<html><body>index</body></html>`,
                'showcase.ejs': `<html><body>showcase</body></html>`,
                '200.ejs': `<html><body>200</body></html>`,
            },
            'public': {},
        });
        return build_1.default({ templateDirectory, outputPath }).then(() => {
            files.forEach((fileName) => {
                expect(fs_extra_1.default.existsSync(path_1.default.join(templateDirectory, fileName + '.ejs'))).toBeTruthy();
                expect(fs_extra_1.default.existsSync(path_1.default.join(outputPath, fileName + '.html'))).toBeTruthy();
                expect(fs_extra_1.default.readFileSync(path_1.default.join(outputPath, fileName + '.html'), { encoding: 'utf8' })).toEqual(`<html><body>${fileName}</body></html>`);
            });
        });
    });
});
//# sourceMappingURL=build.js.map