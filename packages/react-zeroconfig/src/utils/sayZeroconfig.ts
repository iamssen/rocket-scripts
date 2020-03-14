import { say } from 'cfonts';
import fs from 'fs-extra';
import path from 'path';
import { PackageJson } from 'type-fest';

export function sayZeroconfig() {
  say('ZERO\nCONFIG', {font: 'block'});
  
  const {version}: PackageJson = fs.readJsonSync(path.join(__dirname, '../../package.json'));
  
  console.log(`${version}`);
}