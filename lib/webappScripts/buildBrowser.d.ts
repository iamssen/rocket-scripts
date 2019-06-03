import { WebappConfig } from '../types';
export declare function buildBrowser({ mode, output, app, cwd, serverPort, staticFileDirectories, chunkPath, publicPath, appFileName, vendorFileName, styleFileName, sizeReport, extend, zeroconfigPath, }: WebappConfig): Promise<void>;
