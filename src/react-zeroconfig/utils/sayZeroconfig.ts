import { say } from 'cfonts';
import fs from 'fs-extra';
import path from 'path';
import { PackageJson } from 'type-fest';

export function sayZeroconfig() {
  say('ZERO\nCONFIG', { font: 'block' });

  const file: string = path.join(__dirname, '../package.json');

  const { version }: PackageJson = fs.existsSync(file) ? fs.readJsonSync(file) : { version: '0.0.0-test.0' };

  console.log(`${version}`);
}
