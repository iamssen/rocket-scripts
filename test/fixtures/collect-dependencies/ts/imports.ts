import 'rxjs';
import rimraf from 'rimraf';
import { copyTmpDirectory } from '@ssen/tmp-directory';

const tmp: unknown = require('tmp');

async function func() {
  const { eq } = await import('semver');
  console.log(eq);
}

require.resolve('glob');

console.log(rimraf);
console.log(tmp);
console.log(copyTmpDirectory);
