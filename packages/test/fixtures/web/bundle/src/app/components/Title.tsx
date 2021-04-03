import React from 'react';
//@ts-ignore
import svgUrl, { ReactComponent } from './test.svg';

export function Title({ text }: { text: string }) {
  return (
    <div>
      <h1>{text}</h1>
      <p>{svgUrl}</p>
      <ReactComponent />
    </div>
  );
}
