import { Console } from 'console';

/* eslint-disable @typescript-eslint/no-explicit-any */
type ConsoleMethodName = keyof Console;

const methodNames: ConsoleMethodName[] = Object.keys(console).filter(
  (method: string): method is keyof Console =>
    method !== 'Console' &&
    method !== 'context' &&
    typeof console[method as keyof Console] === 'function',
);
const originMethods: Map<ConsoleMethodName, any> = methodNames.reduce(
  (methods, name) => {
    methods.set(name, console[name]);
    return methods;
  },
  new Map(),
);

class ConsoleRouter implements Omit<Console, 'Console'> {
  private consoles: Set<Console> = new Set<Console>();

  add = (console: Console) => this.consoles.add(console);
  delete = (console: Console) => this.consoles.delete(console);
  size = () => this.consoles.size;

  memory = 0;
  exception = (...args: any[]) =>
    this.consoles.forEach((console) => console.exception(...args));
  assert = (...args: any[]) =>
    this.consoles.forEach((console) => console.assert(...args));
  clear = () => this.consoles.forEach((console) => console.clear());
  count = (...args: any[]) =>
    this.consoles.forEach((console) => console.count(...args));
  countReset = (...args: any[]) =>
    this.consoles.forEach((console) => console.countReset(...args));
  debug = (...args: any[]) =>
    this.consoles.forEach((console) => console.debug(...args));
  dir = (...args: any[]) =>
    this.consoles.forEach((console) => console.dir(...args));
  dirxml = (...args: any[]) =>
    this.consoles.forEach((console) => console.dirxml(...args));
  error = (...args: any[]) =>
    this.consoles.forEach((console) => console.error(...args));
  group = (...args: any[]) =>
    this.consoles.forEach((console) => console.group(...args));
  groupCollapsed = (...args: any[]) =>
    this.consoles.forEach((console) => console.groupCollapsed(...args));
  groupEnd = () => this.consoles.forEach((console) => console.groupEnd());
  info = (...args: any[]) =>
    this.consoles.forEach((console) => console.info(...args));
  log = (...args: any[]) =>
    this.consoles.forEach((console) => console.log(...args));
  table = (...args: any[]) =>
    this.consoles.forEach((console) => console.table(...args));
  time = (...args: any[]) =>
    this.consoles.forEach((console) => console.time(...args));
  timeEnd = (...args: any[]) =>
    this.consoles.forEach((console) => console.timeEnd(...args));
  timeLog = (...args: any[]) =>
    this.consoles.forEach((console) => console.timeLog(...args));
  trace = (...args: any[]) =>
    this.consoles.forEach((console) => console.trace(...args));
  warn = (...args: any[]) =>
    this.consoles.forEach((console) => console.warn(...args));
  profile = (...args: any[]) =>
    this.consoles.forEach((console) => console.profile(...args));
  profileEnd = (...args: any[]) =>
    this.consoles.forEach((console) => console.profileEnd(...args));
  timeStamp = (...args: any[]) =>
    this.consoles.forEach((console) => console.timeStamp(...args));
}

let router: ConsoleRouter | null;

export function patchConsole(
  options: NodeJS.ConsoleConstructorOptions,
): () => void {
  const childConsole = new Console(options);

  if (!router) {
    router = new ConsoleRouter();

    for (const method of methodNames) {
      console[method] = router[method as keyof ConsoleRouter];
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
