import chalk from 'chalk';
import fs from 'fs-extra';

export async function watingFiles(files: string[], timeout: number = 1000 * 60): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const t: number = Date.now();

    function remain(): string {
      return `${Math.floor((Date.now() - t) / 1000)}`;
    }

    function start() {
      if (files.every(file => fs.existsSync(file))) {
        resolve();
      } else if (Date.now() - t > timeout) {
        reject(new Error(`Timeout wating... ${files.join(', ')}`));
      } else {
        console.log(chalk.gray(`${remain()} : wating files... ${files.join(', ')}`));
        setTimeout(start, 1000);
      }
    }

    start();

    //console.log(chalk.gray(`${remain()} : wating files... ${files.join(', ')}`));
    //setTimeout(start, 2000);
  });
}
