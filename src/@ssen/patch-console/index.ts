import { Console } from 'console';

/* eslint-disable @typescript-eslint/no-explicit-any */
type ConsoleMethodName = keyof Console;

const methodNames: ConsoleMethodName[] = Object.keys(console).filter(
  (method): method is keyof Console =>
    method !== 'Console' && method !== 'context' && typeof console[method] === 'function',
);
const originMethods: Map<ConsoleMethodName, any> = methodNames.reduce((methods, name) => {
  methods.set(name, console[name]);
  return methods;
}, new Map());

class ConsoleRouter implements Omit<Console, 'Console'> {
  private consoles: Set<Console> = new Set<Console>();

  add = (console: Console) => this.consoles.add(console);
  delete = (console: Console) => this.consoles.delete(console);
  size = () => this.consoles.size;

  memory = 0;
  exception = (...args) => this.consoles.forEach((console) => console.exception(...args));
  assert = (...args) => this.consoles.forEach((console) => console.assert(...args));
  clear = () => this.consoles.forEach((console) => console.clear());
  count = (...args) => this.consoles.forEach((console) => console.count(...args));
  countReset = (...args) => this.consoles.forEach((console) => console.countReset(...args));
  debug = (...args) => this.consoles.forEach((console) => console.debug(...args));
  dir = (...args) => this.consoles.forEach((console) => console.dir(...args));
  dirxml = (...args) => this.consoles.forEach((console) => console.dirxml(...args));
  error = (...args) => this.consoles.forEach((console) => console.error(...args));
  group = (...args) => this.consoles.forEach((console) => console.group(...args));
  groupCollapsed = (...args) => this.consoles.forEach((console) => console.groupCollapsed(...args));
  groupEnd = () => this.consoles.forEach((console) => console.groupEnd());
  info = (...args) => this.consoles.forEach((console) => console.info(...args));
  log = (...args) => this.consoles.forEach((console) => console.log(...args));
  table = (...args) => this.consoles.forEach((console) => console.table(...args));
  time = (...args) => this.consoles.forEach((console) => console.time(...args));
  timeEnd = (...args) => this.consoles.forEach((console) => console.timeEnd(...args));
  timeLog = (...args) => this.consoles.forEach((console) => console.timeLog(...args));
  trace = (...args) => this.consoles.forEach((console) => console.trace(...args));
  warn = (...args) => this.consoles.forEach((console) => console.warn(...args));
  profile = (...args) => this.consoles.forEach((console) => console.profile(...args));
  profileEnd = (...args) => this.consoles.forEach((console) => console.profileEnd(...args));
  timeStamp = (...args) => this.consoles.forEach((console) => console.timeStamp(...args));
}

let router: ConsoleRouter | null;

export function patchConsole(options: NodeJS.ConsoleConstructorOptions): () => void {
  const childConsole = new Console(options);

  if (!router) {
    router = new ConsoleRouter();

    for (const method of methodNames) {
      console[method] = router[method];
    }
  }

  router.add(childConsole);

  return () => {
    if (!router) return;

    router.delete(childConsole);

    if (router.size() === 0) {
      for (const method of methodNames) {
        console[method] = originMethods.get(method);
      }

      router = null;
    }
  };
}
