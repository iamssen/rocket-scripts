"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const getInternalPackageEntry_1 = require("../internalPackage/getInternalPackageEntry");
const exec_promise_1 = require("../utils/exec-promise");
const sayTitle_1 = require("../utils/sayTitle");
const createPackagePublishOptions_1 = require("./createPackagePublishOptions");
const selectPublishOptions_1 = require("./selectPublishOptions");
async function publishPackages({ cwd, choice }) {
    try {
        const entry = getInternalPackageEntry_1.getInternalPackageEntry({ packageDir: path_1.default.join(cwd, 'src/_packages') });
        const publishOptions = await createPackagePublishOptions_1.createPackagePublishOptions({ entry, cwd });
        sayTitle_1.sayTitle('SELECT PACKAGES TO PUBLISH');
        const selectedPublishOptions = await selectPublishOptions_1.selectPublishOptions({ publishOptions, choice });
        for await (const publishOption of selectedPublishOptions) {
            sayTitle_1.sayTitle('PUBLISH PACKAGE - ' + publishOption.name);
            console.log(`npm publish ${publishOption.name} --tag ${publishOption.tag}`);
            console.log('');
            const command = process.platform === 'win32'
                ? `cd "${path_1.default.join(cwd, 'dist/packages', publishOption.name)}" && npm publish --tag ${publishOption.tag}`
                : `cd "${path_1.default.join(cwd, 'dist/packages', publishOption.name)}"; npm publish --tag ${publishOption.tag};`;
            const { stderr, stdout } = await exec_promise_1.exec(command, { encoding: 'utf8' });
            console.log(stdout);
            console.error(stderr);
        }
    }
    catch (error) {
        sayTitle_1.sayTitle('⚠️ PUBLISH PACKAGES ERROR');
        console.error(error);
    }
}
exports.publishPackages = publishPackages;
//# sourceMappingURL=publishPackages.js.map