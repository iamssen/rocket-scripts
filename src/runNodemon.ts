import fs from 'fs';
import nodemon from 'nodemon';
import path from 'path';
import chalk from 'chalk';

interface Params {
  filePath: string;
}

export = function ({filePath}: Params) {
  const start: number = Date.now();
  
  function watingTime(): string {
    return `${Math.floor((Date.now() - start) / 1000)}`;
  }
  
  function test() {
    if (fs.existsSync(filePath)) {
      console.log(chalk.yellow.bold(`🚀 Start nodemon server!`));
      nodemon({
        watch: [
          path.dirname(filePath),
        ],
        exec: `node -r ${path.dirname(require.resolve('source-map-support/package.json'))}/register ${filePath}`,
      });
    } else {
      console.log(chalk.gray(`🕝 Wating "${filePath}" file creation... ${watingTime()}`));
      setTimeout(test, 1000);
    }
  }
  
  console.log(chalk.gray(`🕝 Wating "${filePath}" file creation... ${watingTime()}`));
  setTimeout(test, 2000);
};