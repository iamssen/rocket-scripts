"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const mock_fs_1 = __importDefault(require("mock-fs"));
const path_1 = __importDefault(require("path"));
const copyStaticFiles_1 = __importDefault(require("../../../utils/module/copyStaticFiles"));
describe('module/copyStaticFiles', () => {
    afterEach(() => {
        mock_fs_1.default.restore();
    });
    it('js, ts files should not be copied', () => {
        const appDirectory = __dirname;
        const name = 'test-module';
        const buildOption = {
            name,
            file: path_1.default.join(appDirectory, 'src/_modules', name, 'index.tsx'),
            externals: [],
            declaration: false,
        };
        mock_fs_1.default({
            [path_1.default.join(appDirectory, 'src/_modules', name)]: {
                'index.tsx': `
          import React from 'react';
          
          export default function() {
            return <div>Test</div>;
          }
        `,
                components: {
                    'Test.jsx': `
            import React from 'react';
            
            export default function() {
              return <div>Test</div>;
            }
          `,
                },
                hooks: {
                    'useXYZ.ts': `
            import { useState } from 'react';
    
            export default function() {
              const [x, setX] = useState<number>(0);
              const [y, setY] = useState<number>(0);
              
              return {
                x,
                y,
                z: x + y,
                setX,
                setY,
              };
            }
          `,
                },
                'package.json': `
          {
            "name": "test-module"
          }
        `,
                'readme.md': `
          #Test
        `,
                public: {
                    'test.css': `
            .cls {
              font-size: 10px;
            }
          `,
                },
            },
        });
        return copyStaticFiles_1.default({ buildOption, appDirectory }).then(() => {
            [
                'index.tsx',
                'components/Test.jsx',
                'hooks/useXYZ.ts',
            ].forEach((fileName) => {
                expect(fs_extra_1.default.existsSync(path_1.default.join(appDirectory, 'src/_modules', name, fileName))).toBeTruthy();
                expect(fs_extra_1.default.existsSync(path_1.default.join(appDirectory, 'dist/modules', name, fileName))).toBeFalsy();
            });
            [
                'package.json',
                'readme.md',
                'public/test.css',
            ].forEach((fileName) => {
                expect(fs_extra_1.default.existsSync(path_1.default.join(appDirectory, 'src/_modules', name, fileName))).toBeTruthy();
                expect(fs_extra_1.default.existsSync(path_1.default.join(appDirectory, 'dist/modules', name, fileName))).toBeTruthy();
            });
        });
    });
});
//# sourceMappingURL=copyStaticFiles.js.map