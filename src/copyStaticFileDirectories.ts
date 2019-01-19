import fs from 'fs-extra';
import { Config } from './types';

interface Params {
  staticFileDirectories: Config['app']['staticFileDirectories'];
  outputPath: string;
}

export = function ({staticFileDirectories, outputPath}: Params): Promise<void[]> {
  return fs.mkdirp(outputPath).then(() => {
    return Promise.all<void>(staticFileDirectories.map(dir => fs.copy(dir, outputPath, {dereference: true})));
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
}