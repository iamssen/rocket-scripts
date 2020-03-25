/// <reference path="react"/>

// tslint:disable:no-any
// ---------------------------------------------
// server side rendering
// ---------------------------------------------
declare module 'loadable-stats.json' {
  const content: any;
  export = content;
}

declare module '@loadable/stats.json' {
  const content: any;
  export = content;
}

// ---------------------------------------------
// import types
// ---------------------------------------------
declare module '*.mdx' {
  const content: React.ComponentType<{}>;
  export = content;
}

declare module '*.css' {
  const content: {[className: string]: string};
  export = content;
}

declare module '*.scss' {
  const content: {[className: string]: string};
  export = content;
}

declare module '*.less' {
  const content: {[className: string]: string};
  export = content;
}

declare module '*.json' {
  const content: any;
  export = content;
}

declare module '*.yaml' {
  const content: any;
  export = content;
}

declare module '*.yml' {
  const content: any;
  export = content;
}

declare module '*.svg' {
  const content: string & {ReactComponent: React.ComponentType<React.SVGProps<SVGSVGElement>>};
  export = content;
}

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

declare module '*.txt' {
  const content: string;
  export = content;
}

declare module '*.md' {
  const content: string;
  export = content;
}

declare module '*.ejs' {
  const content: string;
  export = content;
}

declare module '*.*' {
  const content: string;
  export = content;
}
