const fs = require('fs');
const path = require('path');

function getModuleDirectories(from) {
  const moduleDirectories = [];
  const root = path.resolve('/');

  let dir = from;
  while (dir !== root) {
    const modules = path.resolve(dir, 'node_modules');
    
    if (fs.existsSync(modules)) {
      moduleDirectories.push(modules);
    }
    
    dir = path.dirname(dir);
  }

  return moduleDirectories.join(':');
}

process.env.NODE_PATH = getModuleDirectories(__dirname);
