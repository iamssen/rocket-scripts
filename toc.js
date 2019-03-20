const glob = require('glob');
const path = require('path');
const { execSync } = require('child_process');

const commands = [
  'doctoc ./readme.md ./readme.ko.md --notitle --maxlevel 1',
  ...glob.sync('./docs*/*.md').map(file => `doctoc ${file} --notitle`),
]

console.log(execSync(commands.join('; ')).toString());