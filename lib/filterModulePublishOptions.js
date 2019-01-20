"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const prompts_1 = __importDefault(require("prompts"));
const semver_1 = __importDefault(require("semver"));
module.exports = function (publishOptions) {
    return prompts_1.default({
        type: 'multiselect',
        name: 'publishOptions',
        message: 'Select modules to pubblish',
        choices: publishOptions.map(({ name, remoteVersion, workingVersion }) => {
            const cannotPublish = Boolean(remoteVersion && semver_1.default.lte(workingVersion, remoteVersion));
            return {
                title: remoteVersion
                    ? `${name} (${remoteVersion} → ${workingVersion})`
                    : `${name} (→ ${workingVersion})`,
                value: name,
                disabled: cannotPublish,
            };
        }),
    }).then(answer => {
        const filter = new Set(answer.publishOptions);
        return publishOptions.filter(publishOption => filter.has(publishOption.name));
    });
};
//# sourceMappingURL=filterModulePublishOptions.js.map