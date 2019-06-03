"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prompts_1 = __importDefault(require("prompts"));
const semver_1 = __importDefault(require("semver"));
async function selectPublishOptions({ publishOptions }) {
    const answer = await prompts_1.default({
        type: 'multiselect',
        name: 'publishOptions',
        message: 'Select packages to publish',
        choices: publishOptions.map(({ name, currentPackageJson, remotePackageJson }) => {
            const currentVersion = currentPackageJson.version;
            const remoteVersion = remotePackageJson && typeof remotePackageJson.version === 'string' ? remotePackageJson.version : undefined;
            return {
                title: remoteVersion
                    ? `${name} (${remoteVersion} → ${currentVersion})`
                    : `${name} (→ ${currentVersion})`,
                value: name,
                disabled: remoteVersion && semver_1.default.lte(currentVersion, remoteVersion),
            };
        }),
    });
    const filter = new Set(answer.publishOptions);
    return publishOptions.filter(publishOption => filter.has(publishOption.name));
}
exports.selectPublishOptions = selectPublishOptions;
//# sourceMappingURL=selectPublishOptions.js.map