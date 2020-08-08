import { contextBridge } from 'electron';

contextBridge.exposeInMainWorld('hello', {
  world: () => {
    return 'Hello World!';
  },
});
