const fetch = require('node-fetch');
const path = require('path');
const fs = require('fs-extra');

fetch('https://api.github.com/repos/nodejs/node/contents/doc/api')
  .then(res => res.json())
  .then(list => {
    const api = list
      .filter(({name}) => /\.md$/.test(name))
      .map(({name}) => path.basename(name, '.md'));
    
    return fs.writeFile(path.join(__dirname, '../packages/react-zeroconfig/src/internalPackage/node-api-list.json'), JSON.stringify(api));
  });