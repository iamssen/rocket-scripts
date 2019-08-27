"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const escape_string_regexp_1 = __importDefault(require("escape-string-regexp"));
const html_webpack_plugin_1 = __importDefault(require("html-webpack-plugin"));
const webpack_1 = require("webpack");
const types_1 = require("../types");
const sayTitle_1 = require("../utils/sayTitle");
function getProcessEnv() {
    return Object.keys(process.env)
        .filter(key => /^REACT_APP_/i.test(key))
        .reduce((e, key) => {
        e[key] = process.env[key];
        return e;
    }, {});
}
function createWebpackEnvConfig({ serverPort, publicPath }) {
    if (!process.env.NODE_ENV || types_1.isMode(process.env.NODE_ENV)) {
        throw new Error('Required process.env.NODE_ENV');
    }
    const env = {
        ...getProcessEnv(),
        SERVER_PORT: serverPort,
        PUBLIC_PATH: publicPath,
        PUBLIC_URL: publicPath,
        NODE_ENV: process.env.NODE_ENV,
    };
    sayTitle_1.sayTitle('ENV');
    console.log(JSON.stringify(env, null, 2));
    return {
        plugins: [
            new InterpolateHtmlPlugin(html_webpack_plugin_1.default, env),
            new webpack_1.DefinePlugin({
                'process.env': Object.keys(env).reduce((stringifiedEnv, key) => {
                    stringifiedEnv[key] = JSON.stringify(env[key]);
                    return stringifiedEnv;
                }, {}),
            }),
        ],
    };
}
exports.createWebpackEnvConfig = createWebpackEnvConfig;
// from https://github.com/facebook/create-react-app/blob/master/packages/react-dev-utils/InterpolateHtmlPlugin.js
// tslint:disable
class InterpolateHtmlPlugin {
    constructor(htmlWebpackPlugin, replacements) {
        this.htmlWebpackPlugin = htmlWebpackPlugin;
        this.replacements = replacements;
    }
    apply(compiler) {
        compiler.hooks.compilation.tap('InterpolateHtmlPlugin', compilation => {
            this.htmlWebpackPlugin
                .getHooks(compilation)
                .beforeEmit.tap('InterpolateHtmlPlugin', data => {
                // Run HTML through a series of user-specified string replacements.
                Object.keys(this.replacements).forEach(key => {
                    const value = this.replacements[key];
                    data.html = data.html.replace(new RegExp('%' + escape_string_regexp_1.default(key) + '%', 'g'), value);
                });
            });
        });
    }
}
//# sourceMappingURL=createWebpackEnvConfig.js.map