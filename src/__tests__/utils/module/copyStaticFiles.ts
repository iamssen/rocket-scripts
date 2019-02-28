import fs from 'fs-extra';
import mock from 'mock-fs';
import path from 'path';
import { ModuleBuildOption } from '../../../types';
import copyStaticFiles from '../../../utils/module/copyStaticFiles';

describe('module/copyStaticFiles', () => {
  afterEach(() => {
    mock.restore();
  });
  
  it('js, ts files should not be copied', () => {
    const appDirectory: string = __dirname;
    const name: string = 'test-module';
    const buildOption: ModuleBuildOption = {
      name,
      file: path.join(appDirectory, 'src/_modules', name, 'index.tsx'),
      externals: [],
      declaration: false,
    };
    
    mock({
      [path.join(appDirectory, 'src/_modules', name)]: {
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
    
    return copyStaticFiles({buildOption, appDirectory}).then(() => {
      [
        'index.tsx',
        'components/Test.jsx',
        'hooks/useXYZ.ts',
      ].forEach((fileName: string) => {
        expect(fs.existsSync(path.join(appDirectory, 'src/_modules', name, fileName))).toBeTruthy();
        expect(fs.existsSync(path.join(appDirectory, 'dist/modules', name, fileName))).toBeFalsy();
      });
      
      [
        'package.json',
        'readme.md',
        'public/test.css',
      ].forEach((fileName: string) => {
        expect(fs.existsSync(path.join(appDirectory, 'src/_modules', name, fileName))).toBeTruthy();
        expect(fs.existsSync(path.join(appDirectory, 'dist/modules', name, fileName))).toBeTruthy();
      });
    });
  });
});