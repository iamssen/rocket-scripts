"use strict";
const babel_jest_1 = require("babel-jest");
const getBabelConfig_1 = require("../transpile/getBabelConfig");
module.exports = babel_jest_1.createTransformer({
    ...getBabelConfig_1.getBabelConfig({ modules: 'commonjs' }),
});
//# sourceMappingURL=transform.js.map