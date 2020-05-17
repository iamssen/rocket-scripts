import path from 'path';

interface Params {
  cwd: string;
  app: string;
  staticFileDirectories: string[];
}

// <package>/public -> node_modules/package/public | src/package/public
// $CWD/public -> /project/root/public
// /path/to/$APP/public -> /path/to/app/public

export function parseStaticFileDirectories({ cwd, app, staticFileDirectories }: Params): string[] {
  return staticFileDirectories.map((dir) => {
    if (dir === '{default_paths}') return path.join(cwd, 'public');
    return dir.replace(/{app}/g, app).replace(/{cwd}/g, cwd);
  });
}
