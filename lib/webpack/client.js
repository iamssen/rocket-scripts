"use strict";
module.exports = () => (config) => {
    const { app } = config;
    const cacheGroups = {
        // vendor chunk
        vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: app.vendorFileName,
            chunks: 'all',
        },
        // extract single css file
        style: {
            // tslint:disable:no-any
            test: (m) => m.constructor.name === 'CssModule',
            name: app.styleFileName,
            chunks: 'all',
            enforce: true,
        },
    };
    return Promise.resolve({
        output: {
            filename: `${app.buildPath}[name].js`,
            chunkFilename: `${app.buildPath}[name].js`,
        },
        optimization: {
            splitChunks: {
                cacheGroups,
            },
        },
    });
};
//# sourceMappingURL=client.js.map