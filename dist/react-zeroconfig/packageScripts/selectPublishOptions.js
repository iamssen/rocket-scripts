"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectPublishOptions = exports.getVersions = void 0;
const prompts_1 = __importDefault(require("prompts"));
const semver_1 = __importDefault(require("semver"));
function getVersions({ currentPackageJson, remotePackageJson, }) {
    const currentVersion = currentPackageJson.version;
    const remoteVersion = remotePackageJson && typeof remotePackageJson.version === 'string' ? remotePackageJson.version : undefined;
    return { currentVersion, remoteVersion };
}
exports.getVersions = getVersions;
async function selectPublishOptions({ publishOptions, choice, }) {
    if (!choice) {
        const availablePublishOptions = publishOptions.filter((publishOption) => {
            const { currentVersion, remoteVersion } = getVersions(publishOption);
            return !remoteVersion || semver_1.default.gt(currentVersion, remoteVersion);
        });
        if (availablePublishOptions.length > 0) {
            for (const publishOption of availablePublishOptions) {
                const { name, tag } = publishOption;
                const { currentVersion, remoteVersion } = getVersions(publishOption);
                const title = remoteVersion
                    ? `${name}@${tag} (${remoteVersion} → ${currentVersion})`
                    : `${name}@${tag} (→ ${currentVersion})`;
                console.log(title);
            }
        }
        return availablePublishOptions;
    }
    const answer = await prompts_1.default({
        type: 'multiselect',
        name: 'publishOptions',
        message: 'Select packages to publish',
        choices: publishOptions.map((publishOption) => {
            const { name, tag } = publishOption;
            const { currentVersion, remoteVersion } = getVersions(publishOption);
            return {
                title: remoteVersion
                    ? `${name}@${tag} (${remoteVersion} → ${currentVersion})`
                    : `${name}@${tag} (→ ${currentVersion})`,
                value: name,
                disabled: remoteVersion && semver_1.default.lte(currentVersion, remoteVersion),
            };
        }),
    });
    const filter = new Set(answer.publishOptions);
    return publishOptions.filter((publishOption) => filter.has(publishOption.name));
}
exports.selectPublishOptions = selectPublishOptions;
//# sourceMappingURL=selectPublishOptions.js.map