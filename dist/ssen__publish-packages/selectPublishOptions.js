"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectPublishOptions = exports.getVersions = void 0;
const prompts_1 = __importDefault(require("prompts"));
const semver_1 = __importDefault(require("semver"));
function getVersions({ current, remote, }) {
    const currentVersion = current.version;
    const remoteVersion = remote && typeof remote.version === 'string' ? remote.version : undefined;
    return { currentVersion, remoteVersion };
}
exports.getVersions = getVersions;
async function selectPublishOptions({ publishOptions, force }) {
    if (force) {
        // no remote package
        // or build version is higher than remote version
        const availablePublishOptions = Array.from(publishOptions.values()).filter((publishOption) => {
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
    else {
        const answer = await prompts_1.default({
            type: 'multiselect',
            name: 'publishOptions',
            message: 'Select packages to publish',
            choices: Array.from(publishOptions.values()).map((publishOption) => {
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
        return Array.from(publishOptions.values()).filter((publishOption) => filter.has(publishOption.name));
    }
}
exports.selectPublishOptions = selectPublishOptions;
//# sourceMappingURL=selectPublishOptions.js.map