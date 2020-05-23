"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWebpackScriptLoaders = void 0;
function getWebpackScriptLoaders(params) {
    const { include } = params;
    const scriptRegex = /\.(ts|tsx|js|mjs|jsx)$/;
    const workerRegex = /\.worker.(ts|tsx|js|mjs|jsx)$/;
    const babelLoader = {
        loader: require.resolve('babel-loader'),
        options: params.babelLoaderOptions,
    };
    if (params.useWebWorker) {
        const { chunkPath, publicPath } = params;
        return [
            {
                test: workerRegex,
                include,
                use: [
                    {
                        loader: require.resolve('worker-loader'),
                        options: {
                            name: `${chunkPath}[hash].worker.js`,
                            publicPath,
                        },
                    },
                    babelLoader,
                ],
            },
            {
                test: scriptRegex,
                include,
                use: babelLoader,
            },
            {
                test: /\.mjs$/,
                include: /node_modules/,
                type: 'javascript/auto',
            },
        ];
    }
    else {
        return [
            {
                test: scriptRegex,
                include,
                use: babelLoader,
            },
            {
                test: /\.mjs$/,
                include: /node_modules/,
                type: 'javascript/auto',
            },
        ];
    }
}
exports.getWebpackScriptLoaders = getWebpackScriptLoaders;
//# sourceMappingURL=getWebpackScriptLoaders.js.map