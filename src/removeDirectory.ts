import rimraf from 'rimraf';

export = function (path: string): Promise<void> {
  return new Promise((resolve: () => void, reject: (error: Error) => void) => {
    rimraf(path, (error: Error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}