declare module 'cfonts' {
  interface Options {
    font?:
      | 'block'
      | 'slick'
      | 'tiny'
      | 'grid'
      | 'pallet'
      | 'shade'
      | 'chrome'
      | 'simple'
      | 'simpleBlock'
      | '3d'
      | 'simple3d'
      | 'huge'
      | 'console';
    align?: 'left' | 'center' | 'right';
    colors?: string[];
    background?:
      | 'transparent'
      | 'black'
      | 'red'
      | 'green'
      | 'yellow'
      | 'blue'
      | 'magenta'
      | 'cyan'
      | 'white'
      | 'blackBright'
      | 'redBright'
      | 'greenBright'
      | 'yellowBright'
      | 'blueBright'
      | 'magentaBright'
      | 'cyanBright'
      | 'whiteBright';
    letterSpacing?: number;
    lineHeight?: number;
    space?: boolean;
    maxLength?: number;
    gradient?: string[] | false;
    independentGradient?: boolean;
    transitionGradient?: boolean;
    env?: 'node' | 'browser';
  }

  interface Result {
    string: string;
    array: string[];
    lines: boolean;
    options: Options;
  }

  interface Size {
    width: number;
    height: number;
  }

  export const render: (
    text: string,
    option: Options,
    debug?: boolean,
    debugLevl?: number,
    size?: Size,
  ) => Result;

  export const say: (text: string, option: Options, debug?: boolean, debugLevl?: number, size?: Size) => void;
}
