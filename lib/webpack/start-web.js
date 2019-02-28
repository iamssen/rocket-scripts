"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const path_1 = __importDefault(require("path"));
const webpack_1 = __importDefault(require("webpack"));
module.exports = () => ({ app, appDirectory }) => {
    return Promise.resolve({
        entry: app.entry.reduce((entry, entryItemName) => {
            entry[entryItemName] = [
                `${path_1.default.dirname(require.resolve('webpack-hot-middleware/package.json'))}/client?http://localhost:${app.port}`,
                `${path_1.default.dirname(require.resolve('webpack/package.json'))}/hot/only-dev-server`,
                path_1.default.join(appDirectory, 'src/_entry', entryItemName),
            ];
            return entry;
        }, {}),
        optimization: {
            namedModules: true,
            noEmitOnErrors: true,
        },
        plugins: [
            new webpack_1.default.HotModuleReplacementPlugin(),
        ],
    });
};
//# sourceMappingURL=start-web.js.map