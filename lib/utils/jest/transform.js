"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const babel_jest_1 = require("babel-jest");
const getBabelConfig_1 = __importDefault(require("../babel/getBabelConfig"));
module.exports = babel_jest_1.createTransformer({
    ...getBabelConfig_1.default({
        modules: 'commonjs',
    }),
});
//# sourceMappingURL=transform.js.map