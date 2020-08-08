export function filterReactEnv(env: NodeJS.ProcessEnv): NodeJS.ProcessEnv {
  return Object.keys(env)
    .filter((key) => /^REACT_APP_/i.test(key))
    .reduce((e, key) => {
      e[key] = env[key];
      return e;
    }, {});
}
