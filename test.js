const env = Object.keys(process.env)
  .filter((x) => !/^npm_/.test(x))
  .reduce((env, key) => {
    env[key] = process.env[key];
    return env;
  }, {});

console.log(env['MODE'], env['XXX'], env['YYY']);
