import ejs from 'ejs';
import fs from 'fs';
import glob from 'glob';
import path from 'path';

interface Params {
  templateDirectory: string;
  outputPath: string;
}

export = function ({templateDirectory, outputPath}: Params): Promise<void> {
  return new Promise<void>((resolve: () => void, reject: (error: Error) => void) => {
    glob(
      `${templateDirectory}/*.ejs`,
      (error: Error, filePaths: string[]) => {
        if (error) {
          reject(error);
          return;
        }
        
        for (const filePath of filePaths) {
          const fileName: string = path.basename(filePath, '.ejs');
          const template: string = fs.readFileSync(filePath, {encoding: 'utf8'});
          const html: string = ejs.render(template);
          
          fs.writeFileSync(path.join(outputPath, `${fileName}.html`), html, {encoding: 'utf8'});
        }
        
        resolve();
      },
    );
  });
}