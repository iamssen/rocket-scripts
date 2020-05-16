"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBabelConfig = void 0;
const getBrowserslistQuery_1 = require("./getBrowserslistQuery");
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
function getBabelConfig({ modules, cwd, targets, }) {
    if (!targets)
        targets = getBrowserslistQuery_1.getBrowserslistQuery({ cwd });
    if (!process.env.JEST_WORKER_ID) {
        console.log('');
        console.log('---------------------------------------------------------------------------------');
        console.log('= BABEL PRESET-ENV TARGETS (=BROWSERSLIST QUERY) : ', targets);
        console.log('---------------------------------------------------------------------------------');
    }
    return {
        presets: [
            [
                require.resolve('@react-zeroconfig/babel-preset'),
                {
                    modules,
                    targets,
                },
            ],
        ],
        plugins: [
            require.resolve('@loadable/babel-plugin'),
            [
                require.resolve('babel-plugin-named-asset-import'),
                {
                    loaderMap: {
                        svg: {
                            ReactComponent: '@svgr/webpack?-svgo,+titleProp,+ref![path]',
                        },
                    },
                },
            ],
            require.resolve('@handbook/babel-plugin'),
            // babel-plugin-styled-components
            //...(() => {
            //  const {dependencies}: PackageJson = fs.readJsonSync(path.join(cwd, 'package.json'));
            //  if (!dependencies) return [];
            //
            //  return dependencies['styled-components']
            //    ? [require.resolve('babel-plugin-styled-components')]
            //    : [];
            //})(),
            ...(() => {
                const { dependencies } = fs_extra_1.default.readJsonSync(path_1.default.join(cwd, 'package.json'));
                if (!dependencies)
                    return [];
                const pluginImports = [];
                if (dependencies['antd']) {
                    pluginImports.push([
                        require.resolve('babel-plugin-import'),
                        {
                            libraryName: 'antd',
                        },
                        'tree-shaking-antd',
                    ]);
                }
                if (dependencies['@material-ui/core']) {
                    pluginImports.push([
                        require.resolve('babel-plugin-import'),
                        {
                            libraryName: '@material-ui/core',
                            libraryDirectory: '',
                            camel2DashComponentName: false,
                        },
                        'tree-shaking-mui-core',
                    ]);
                }
                if (dependencies['@material-ui/icons']) {
                    pluginImports.push([
                        require.resolve('babel-plugin-import'),
                        {
                            libraryName: '@material-ui/icons',
                            libraryDirectory: '',
                            camel2DashComponentName: false,
                        },
                        'tree-shaking-mui-icons',
                    ]);
                }
                return pluginImports;
            })(),
        ],
    };
}
exports.getBabelConfig = getBabelConfig;
//# sourceMappingURL=getBabelConfig.js.map