// ---------------------------------------------
// data uri / image
// ---------------------------------------------
declare module '*.bmp' {
  const content: string;
  export = content;
}

declare module '*.gif' {
  const content: string;
  export = content;
}

declare module '*.jpg' {
  const content: string;
  export = content;
}

declare module '*.jpeg' {
  const content: string;
  export = content;
}

declare module '*.png' {
  const content: string;
  export = content;
}

declare module '*.webp' {
  const content: string;
  export = content;
}

// ---------------------------------------------
// mdx
// ---------------------------------------------
declare module '*.mdx' {
  import React from 'react';
  const content: React.ComponentType<{}>;
  export = content;
}

// ---------------------------------------------
// raw
// ---------------------------------------------
declare module '*.html' {
  const content: string;
  export = content;
}

declare module '*.ejs' {
  const content: string;
  export = content;
}

declare module '*.txt' {
  const content: string;
  export = content;
}

declare module '*.md' {
  const content: string;
  export = content;
}

// ---------------------------------------------
// style
// ---------------------------------------------
declare module '*.css' {
  const content: { [className: string]: string };
  export = content;
}

declare module '*.sass' {
  const content: { [className: string]: string };
  export = content;
}

declare module '*.scss' {
  const content: { [className: string]: string };
  export = content;
}

declare module '*.less' {
  const content: { [className: string]: string };
  export = content;
}

// ---------------------------------------------
// svg
// ---------------------------------------------
declare module '*.svg' {
  import React from 'react';
  const content: string & { ReactComponent: React.ComponentType<React.SVGProps<SVGSVGElement>> };
  export = content;
}

// ---------------------------------------------
// yaml
// ---------------------------------------------
declare module '*.yaml' {
  const content: any;
  export = content;
}

declare module '*.yml' {
  const content: any;
  export = content;
}

// ---------------------------------------------
// webpack default
// ---------------------------------------------
declare module '*.json' {
  const content: any;
  export = content;
}

// ---------------------------------------------
// fallback
// ---------------------------------------------
declare module '*.*' {
  const content: string;
  export = content;
}
