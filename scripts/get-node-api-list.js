const fetch = require('node-fetch');
const path = require('path');
const fs = require('fs-extra');

fetch('https://api.github.com/repos/nodejs/node/contents/doc/api')
  .then(res => res.json())
  .then(list => {
    const api = list
      .filter(({name}) => /\.md$/.test(name))
      .map(({name}) => path.basename(name, '.md'));
    
    console.log('get-node-api-list.js..()', JSON.stringify(api));
    
    // TODO
    //return fs.writeFile(path.join(__dirname, '../src/react-zeroconfig/internalPackage/node-api-list.json'), JSON.stringify(api));
  });