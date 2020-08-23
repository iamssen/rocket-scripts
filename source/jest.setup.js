const fs = require('fs');
const path = require('path');

function getNodeModules(start) {
  const nodeModules = [];

  let dir = start;
  const top = path.resolve('/');

  while (dir !== top) {
    const modules = path.resolve(dir, 'node_modules');

    if (fs.existsSync(modules)) {
      nodeModules.push(modules);
    }

    dir = path.dirname(dir);
  }

  return nodeModules.join(':');
}

process.env.NODE_PATH = getNodeModules(__dirname);
