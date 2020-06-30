import { EventEmitter } from 'events';
import { render } from 'ink';
import { ReactElement } from 'react';

export class InkWritableStream extends EventEmitter {
  get columns() {
    return 100;
  }

  readonly frames: string[] = [];
  private _lastFrame?: string;

  write = (frame: string) => {
    this.frames.push(frame);
    this._lastFrame = frame;
  };

  lastFrame = () => {
    return this._lastFrame;
  };
}

export function createInkWriteStream(): InkWritableStream & NodeJS.WriteStream {
  return (new InkWritableStream() as unknown) as InkWritableStream & NodeJS.WriteStream;
}

export function inkToString(element: ReactElement): string {
  const stdout = createInkWriteStream();

  const { unmount } = render(element, { stdout });

  unmount();

  return stdout.lastFrame() ?? '';
}
