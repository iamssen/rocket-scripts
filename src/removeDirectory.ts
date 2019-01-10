import rimraf from 'rimraf';

export = function (path: string): Promise<void> {
  return new Promise((resolve, reject) => {
    rimraf(path, error => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}