import { Config, ModulePublishOption } from '../../types';
interface Params {
    version: string;
    appDirectory: Config['appDirectory'];
    modules: Config['modules']['entry'];
    getRemoteVersion?: (name: string, version: string) => Promise<ModulePublishOption['remoteVersion']>;
}
declare const _default: ({ modules, appDirectory, version, getRemoteVersion }: Params) => Promise<ModulePublishOption[]>;
export = _default;
