import fs from 'fs-extra';
import mock from 'mock-fs';
import path from 'path';
import build from '../../../utils/template/build';

describe('template/build', () => {
  afterEach(() => {
    mock.restore();
  });
  
  it('Should be created html files', () => {
    const templateDirectory: string = 'src/_templates';
    const outputPath: string = 'public';
    const files: string[] = ['index', 'showcase', '200'];
    
    mock({
      [templateDirectory]: {
        'index.ejs': `<html><body>index</body></html>`,
        'showcase.ejs': `<html><body>showcase</body></html>`,
        '200.ejs': `<html><body>200</body></html>`,
      },
      'public': {},
    });
    
    return build({templateDirectory, outputPath}).then(() => {
      files.forEach((fileName: string) => {
        expect(fs.existsSync(path.join(templateDirectory, fileName + '.ejs'))).toBeTruthy();
        expect(fs.existsSync(path.join(outputPath, fileName + '.html'))).toBeTruthy();
        expect(fs.readFileSync(path.join(outputPath, fileName + '.html'), {encoding: 'utf8'})).toEqual(`<html><body>${fileName}</body></html>`);
      });
    });
  });
});