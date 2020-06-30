import { Console } from 'console';

export function patchConsole(options: NodeJS.ConsoleConstructorOptions) {
  const orig = { ...global.console };
  const patch = new Console(options);

  const functions = Object.keys(orig).filter((key) => typeof orig[key] === 'function');

  for (const fn of functions) {
    global.console[fn] = patch[fn];
  }

  return () => {
    for (const fn of functions) {
      global.console[fn] = orig[fn];
    }
  };
}
