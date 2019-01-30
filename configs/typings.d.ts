/// <reference path="react"/>

// tslint:disable:no-any
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

declare module '*.svg' {
  const content: string & { ReactComponent: React.ComponentType<React.SVGProps<SVGSVGElement>>};
  export = content;
}

declare module '*' {
  const content: string;
  export = content;
}
