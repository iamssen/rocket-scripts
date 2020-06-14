import AnsiConverter from 'ansi-to-html';
import { Color, render } from 'ink';
import React from 'react';

interface Stream {
  output: string;
  columns: number;

  write(str: string): void;

  get(): string;
}

const createToStringStream: (options: { columns: number }) => Stream = ({ columns }) => {
  let output: string = '';
  return {
    output,
    columns,
    write(str: string) {
      output = str;
    },
    get() {
      return output;
    },
  };
};

describe('ink', () => {
  test('should render to string', () => {
    const stream: Stream = createToStringStream({ columns: 100 });
    render(
      <>
        <Color blue>Hello?</Color>
        <Color red>World?</Color>
      </>,
      {
        //@ts-ignore
        stdout: stream,
        debug: true,
      },
    );

    const ansi: string = stream.get();

    const converter: AnsiConverter = new AnsiConverter({ newline: true });
    const html: string = converter.toHtml(ansi);

    expect(html).toBe(
      '<span style="color:#00A">Hello?<span style="color:#FFF"><br/><span style="color:#A00">World?<span style="color:#FFF"></span></span></span></span>',
    );
  });
});
