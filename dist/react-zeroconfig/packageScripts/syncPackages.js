"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncPackages = void 0;
const sayTitle_1 = require("../utils/sayTitle");
const findMissingDependencies_1 = require("./findMissingDependencies");
async function syncPackages({ cwd }) {
    const missingDependencies = await findMissingDependencies_1.findMissingDependencies({ cwd });
    if (Object.keys(missingDependencies).length > 0) {
        //const nextDependencies: PackageJson.Dependency = {
        //  ...hostDependencies,
        //  ...diffDependencies,
        //};
        //const nextPackageJson: PackageJson = {...hostPackageJson};
        //nextPackageJson.dependencies = nextDependencies;
        //
        //await fs.writeJson(path.join(cwd, 'package.json'), nextPackageJson, {encoding: 'utf8'});
        sayTitle_1.sayTitle('ADD TO ROOT PACKAGE.JSON');
        console.log(JSON.stringify({ dependencies: missingDependencies }, null, 2));
    }
}
exports.syncPackages = syncPackages;
//# sourceMappingURL=syncPackages.js.map