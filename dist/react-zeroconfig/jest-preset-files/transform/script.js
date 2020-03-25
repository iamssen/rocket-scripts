"use strict";
const index_1 = require("babel-jest/build/index");
const getBabelConfig_1 = require("../../transpile/getBabelConfig");
module.exports = index_1.createTransformer({
    ...getBabelConfig_1.getBabelConfig({ modules: 'commonjs', cwd: process.cwd() }),
});
//# sourceMappingURL=script.js.map