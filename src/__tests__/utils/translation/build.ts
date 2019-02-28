import fs from 'fs-extra';
import mock from 'mock-fs';
import path from 'path';
import { TranslationType } from '../../../types';
import build from '../../../utils/translation/build';

describe('translation/build', () => {
  afterEach(() => mock.restore());
  
  it('Should be created the locale.json file', () => {
    const appDirectory: string = __dirname;
    const outputPath: string = path.join(appDirectory, 'src/generated/locales.json');
    const type: TranslationType = 'intl';
    
    mock({
      [path.join(appDirectory, 'src')]: {
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
    
    expect(fs.existsSync(path.join(appDirectory, 'src/app/locales/en-US.json'))).toBeTruthy();
    expect(fs.existsSync(path.join(appDirectory, 'src/app/locales/ko-KR.json'))).toBeTruthy();
    expect(fs.existsSync(path.join(appDirectory, 'src/contents/locales/en-US.json'))).toBeTruthy();
    expect(fs.existsSync(path.join(appDirectory, 'src/contents/locales/ko-KR.json'))).toBeTruthy();
    
    return build({
      appDirectory,
      outputPath,
      type,
      globPattern: `${appDirectory}/src/*/locales/[a-z][a-z]-[A-Z][A-Z].json`,
    }).then(() => {
      const filePath: string = path.join(appDirectory, 'src/generated/locales.json');
      
      expect(fs.existsSync(filePath)).toBeTruthy();
      
      const json: object = fs.readJsonSync(filePath, {encoding: 'utf8'});
      
      expect(json['en-US']['a.b.c']).toEqual('ABC');
      expect(json['ko-KR']['a.b.c']).toEqual('가나다');
      expect(json['en-US']['x.y']).toEqual('XY');
      expect(json['ko-KR']['x.y']).toEqual('엑와');
    });
  });
});