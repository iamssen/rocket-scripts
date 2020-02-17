"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getWebpackYamlLoaders() {
    return [
        {
            test: /\.(yaml|yml)$/,
            use: [
                require.resolve('json-loader'),
                require.resolve('yaml-loader'),
            ],
        },
    ];
}
exports.getWebpackYamlLoaders = getWebpackYamlLoaders;
//# sourceMappingURL=getWebpackYamlLoaders.js.map