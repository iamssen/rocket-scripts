"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mock_fs_1 = __importDefault(require("mock-fs"));
const path_1 = __importDefault(require("path"));
const getDefaultEntry_1 = require("../../utils/createConfig/getDefaultEntry");
describe('createConfig', () => {
    it('Should be matched module directories locations and module names', () => {
        const moduleDirectories = [
            '/Test/src/_modules/@ssen/test-module1',
            '/Test/src/_modules/@ssen/test-module2',
            '/Test/src/_modules/test-module3',
            '/Test/src/_modules/test-module4',
            '/Test/src/_modules/@xxx/ddd/eee/test-module8',
            '/Test/src/_modules/@test/test-module5',
        ];
        const moduleRoot = '/Test/src/_modules';
        const dirModuleNames = moduleDirectories
            .map((dirname) => path_1.default.relative(moduleRoot, dirname).split(path_1.default.sep))
            .filter((dirnamePaths) => dirnamePaths.length < 3)
            .map((dirnamePaths) => dirnamePaths.join('/'));
        expect(dirModuleNames).toEqual([
            '@ssen/test-module1',
            '@ssen/test-module2',
            'test-module3',
            'test-module4',
            '@test/test-module5',
        ]);
    });
    describe('getDefaultEntry', () => {
        afterEach(() => mock_fs_1.default.restore());
        it('Should be got entry from _app directory', () => {
            const appDirectory = __dirname;
            const source = `
        import React from 'react';
        
        export default function() {
          return <div>test</div>;
        }
      `;
            mock_fs_1.default({
                [appDirectory]: {
                    src: {
                        _app: {
                            'test1.tsx': source,
                            'test2.jsx': source,
                            'test3': {
                                'index.tsx': source,
                            },
                            'test4': {
                                'index.jsx': source,
                            },
                        },
                    },
                },
            });
            expect(getDefaultEntry_1.getDefaultEntry(appDirectory)).toEqual(['test1', 'test2', 'test3', 'test4']);
        });
    });
    // using mock-fs with glob pattern `dir/**/some.js` make error
    //describe('getDefaultModuleEntry', () => {
    //  afterEach(() => {
    //    mock.restore();
    //    flush();
    //  });
    //
    //  it('Should be got modules entry from _modules/**/* directory', () => {
    //    const appDirectory: string = __dirname;
    //
    //    mock({
    //      [appDirectory]: {
    //        src: {
    //          _modules: {
    //            'test1': {
    //              'package.js': ``,
    //            },
    //            'test2': {
    //              'package.js': ``,
    //            },
    //            '@test': {
    //              'test3': {
    //                'package.js': ``,
    //              },
    //              'test4': {
    //                'package.js': ``,
    //              },
    //            },
    //          },
    //        },
    //      },
    //    });
    //
    //    log(fs.existsSync(path.join(appDirectory, 'src/_modules/test1/package.js')));
    //    log(fs.existsSync(path.join(appDirectory, 'src/_modules/test1/package.js/package.json')));
    //    log(glob.sync(`${appDirectory}/src/_modules/**/package.tsx`));
    //    log(getDefaultModulesEntry(appDirectory));
    //
    //    //expect(getDefaultModulesEntry(appDirectory)).toEqual(['test1', 'test2', '@test/test3', '@test/test4']);
    //
    //    return new Promise((resolve: () => void) => {
    //      glob(`${appDirectory}/src/_modules/**/package.json`, (err: Error, list: string[]) => {
    //        log(list);
    //        resolve();
    //      });
    //    });
    //  });
    //});
});
//# sourceMappingURL=createConfig.js.map