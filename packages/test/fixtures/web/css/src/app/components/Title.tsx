import React from 'react';

export function Title({ text, className }: { text: string, className: string }) {
  return <h1 className={className}>{text}</h1>;
}
