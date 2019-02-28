"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const mock_fs_1 = __importDefault(require("mock-fs"));
const path_1 = __importDefault(require("path"));
const build_1 = __importDefault(require("../../../utils/translation/build"));
describe('translation/build', () => {
    afterEach(() => mock_fs_1.default.restore());
    it('Should be created the locale.json file', () => {
        const appDirectory = __dirname;
        const outputPath = path_1.default.join(appDirectory, 'src/generated/locales.json');
        const type = 'intl';
        mock_fs_1.default({
            [path_1.default.join(appDirectory, 'src')]: {
                app: {
                    locales: {
                        'en-US.json': JSON.stringify({
                            a: {
                                b: {
                                    c: 'ABC',
                                },
                            },
                        }),
                        'ko-KR.json': JSON.stringify({
                            a: {
                                b: {
                                    c: '가나다',
                                },
                            },
                        }),
                    },
                },
                contents: {
                    locales: {
                        'en-US.json': JSON.stringify({
                            x: {
                                y: 'XY',
                            },
                        }),
                        'ko-KR.json': JSON.stringify({
                            x: {
                                y: '엑와',
                            },
                        }),
                    },
                },
            },
        });
        expect(fs_extra_1.default.existsSync(path_1.default.join(appDirectory, 'src/app/locales/en-US.json'))).toBeTruthy();
        expect(fs_extra_1.default.existsSync(path_1.default.join(appDirectory, 'src/app/locales/ko-KR.json'))).toBeTruthy();
        expect(fs_extra_1.default.existsSync(path_1.default.join(appDirectory, 'src/contents/locales/en-US.json'))).toBeTruthy();
        expect(fs_extra_1.default.existsSync(path_1.default.join(appDirectory, 'src/contents/locales/ko-KR.json'))).toBeTruthy();
        return build_1.default({
            appDirectory,
            outputPath,
            type,
            globPattern: `${appDirectory}/src/*/locales/[a-z][a-z]-[A-Z][A-Z].json`,
        }).then(() => {
            const filePath = path_1.default.join(appDirectory, 'src/generated/locales.json');
            expect(fs_extra_1.default.existsSync(filePath)).toBeTruthy();
            const json = fs_extra_1.default.readJsonSync(filePath, { encoding: 'utf8' });
            expect(json['en-US']['a.b.c']).toEqual('ABC');
            expect(json['ko-KR']['a.b.c']).toEqual('가나다');
            expect(json['en-US']['x.y']).toEqual('XY');
            expect(json['ko-KR']['x.y']).toEqual('엑와');
        });
    });
});
//# sourceMappingURL=build.js.map