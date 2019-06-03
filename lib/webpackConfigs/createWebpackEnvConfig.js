"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const webpack_1 = require("webpack");
function createWebpackEnvConfig({ serverPort, publicPath }) {
    return {
        plugins: [
            new webpack_1.DefinePlugin({
                'process.env.SERVER_PORT': JSON.stringify(serverPort),
                'process.env.PUBLIC_PATH': JSON.stringify(publicPath),
            }),
        ],
    };
}
exports.createWebpackEnvConfig = createWebpackEnvConfig;
//# sourceMappingURL=createWebpackEnvConfig.js.map