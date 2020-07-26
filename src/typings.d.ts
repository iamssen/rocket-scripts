/// <reference types="rocket-punch/typings"/>

import '@testing-library/react-hooks';

declare module '@testing-library/react-hooks' {
  declare interface WaitOptions {
    interval?: number;
    timeout?: number;
    suppressErrors?: boolean;
  }
}
