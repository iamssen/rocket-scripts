"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTmpFixture = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const tmp_1 = __importDefault(require("tmp"));
async function createTmpFixture(id) {
    const mock = path_1.default.join(__dirname, '../../../test/fixtures', id);
    const { name } = tmp_1.default.dirSync();
    await fs_extra_1.default.copy(mock, name);
    return fs_extra_1.default.realpathSync(name);
}
exports.createTmpFixture = createTmpFixture;
//# sourceMappingURL=createTmpFixture.js.map