import { WebappConfig } from '../types';
export declare function startBrowser({ cwd, app, output, port, https, serverPort, staticFileDirectories, chunkPath, publicPath, internalEslint, appFileName, vendorFileName, styleFileName, extend, zeroconfigPath, }: WebappConfig): Promise<void>;
