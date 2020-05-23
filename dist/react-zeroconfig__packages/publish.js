"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.publish = void 0;
const getPackagesEntry_1 = require("./entry/getPackagesEntry");
const promised_1 = require("@ssen/promised");
const publish_packages_1 = require("@ssen/publish-packages");
const path_1 = __importDefault(require("path"));
async function publish({ cwd, outDir, force = false, registry, tag }) {
    try {
        const entry = await getPackagesEntry_1.getPackagesEntry({ cwd });
        const publishOptions = await publish_packages_1.getPublishOptions({
            entry,
            outDir,
            registry,
            tag,
        });
        const selectedPublishOptions = await publish_packages_1.selectPublishOptions({
            publishOptions,
            force,
        });
        for (const publishOption of selectedPublishOptions) {
            const t = ` --tag ${tag || publishOption.tag}`;
            const r = registry ? ` --registry "${registry}"` : '';
            console.log(`npm publish ${publishOption.name}${t}${r}`);
            console.log('');
            const command = process.platform === 'win32'
                ? `cd "${path_1.default.join(cwd, 'dist', publishOption.name)}" && npm publish${t}${r}`
                : `cd "${path_1.default.join(cwd, 'dist', publishOption.name)}"; npm publish${t}${r};`;
            const { stderr, stdout } = await promised_1.exec(command, { encoding: 'utf8' });
            console.log(stdout);
            console.error(stderr);
        }
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
}
exports.publish = publish;
//# sourceMappingURL=publish.js.map