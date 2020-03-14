"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("browserslist/node");
const defaultQuery = {
    'production': [
        '>0.2%',
        'not dead',
        'not op_mini all',
    ],
    'development': [
        'last 1 chrome version',
        'last 1 firefox version',
        'last 1 safari version',
        'ie 11',
    ],
    'server': 'node 10',
    'server_development': 'current node',
    'electron': 'last 1 electron version',
    'package': [
        '>0.2%',
        'not dead',
        'not op_mini all',
    ],
    'defaults': 'current node',
};
function getBrowserslistQuery({ cwd }) {
    const query = node_1.loadConfig({ path: cwd });
    return query || defaultQuery[process.env.BROWSERSLIST_ENV || 'defaults'] || defaultQuery['defaults'];
}
exports.getBrowserslistQuery = getBrowserslistQuery;
//# sourceMappingURL=getBrowserslistQuery.js.map