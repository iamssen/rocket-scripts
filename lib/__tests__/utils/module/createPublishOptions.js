"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const package_json_1 = __importDefault(require("package-json"));
describe('createPublishOptions', () => {
    it('Should be got versions', () => {
        return package_json_1.default('react-zeroconfig').then((value) => {
            expect(typeof value.version).toEqual('string');
        });
    });
});
//# sourceMappingURL=createPublishOptions.js.map