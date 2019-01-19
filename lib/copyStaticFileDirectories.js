"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const fs_extra_1 = __importDefault(require("fs-extra"));
module.exports = function ({ staticFileDirectories, outputPath }) {
    return fs_extra_1.default.mkdirp(outputPath).then(() => {
        return Promise.all(staticFileDirectories.map(dir => fs_extra_1.default.copy(dir, outputPath, { dereference: true })));
    });
    // 음... string replace 방식으로 하면 browser-sync 상황에서 문제가 생길듯...
    //.then(() => {
    //  const manifestFilePath = `${outputPath}/${buildPath}${manifestFileName}`;
    //
    //  if (fs.statSync(manifestFilePath).isFile()) {
    //    const manifest = fs.readJSONSync(manifestFilePath, {encoding: 'utf8'});
    //    const assets = Object.keys(manifest);
    //
    //    glob(`${outputPath}/*.html`, {}, (error, htmlFiles) => {
    //      if (error) throw error;
    //
    //      for (const htmlFile of htmlFiles) {
    //        const originHtml = fs.readFileSync(htmlFile, {encoding: 'utf8'});
    //        let html = originHtml;
    //
    //        for (const asset of assets) {
    //          html = html.replace(new RegExp(asset, 'g'), manifest[asset]);
    //        }
    //
    //        if (originHtml !== html) {
    //          fs.writeFileSync(htmlFile, html, {encoding: 'utf8'});
    //        }
    //      }
    //    });
    //  }
    //});
};
//# sourceMappingURL=copyStaticFileDirectories.js.map