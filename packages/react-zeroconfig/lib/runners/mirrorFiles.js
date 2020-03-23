"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chokidar_1 = require("chokidar");
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const rxjs_1 = require("rxjs");
var MirrorTreat;
(function (MirrorTreat) {
    MirrorTreat["ADDED"] = "added";
    MirrorTreat["UPDATED"] = "updated";
    MirrorTreat["REMOVED"] = "removed";
})(MirrorTreat = exports.MirrorTreat || (exports.MirrorTreat = {}));
async function mirrorFiles({ sources, output, ignored }) {
    function toRelativePath(file) {
        const source = sources.find((s) => file.indexOf(s) === 0);
        return source ? path_1.default.relative(source, file) : undefined;
    }
    await fs_extra_1.default.mkdirp(output);
    await Promise.all(sources.map((dir) => {
        return fs_extra_1.default.copy(dir, output, {
            dereference: false,
            filter: (src) => {
                return ignored ? !ignored.test(src) : true;
            },
        });
    }));
    return new rxjs_1.Observable((observer) => {
        const watcher = chokidar_1.watch(sources, {
            ignored,
            persistent: true,
            ignoreInitial: true,
        });
        watcher
            .on('add', async (file) => {
            const relpath = toRelativePath(file);
            if (!relpath) {
                console.log(`Can't found ${file} from sources`);
                return;
            }
            const tofile = path_1.default.join(output, relpath);
            await fs_extra_1.default.mkdirp(path_1.default.dirname(tofile));
            await fs_extra_1.default.copy(file, tofile, { dereference: false });
            observer.next({
                file: relpath,
                treat: MirrorTreat.ADDED,
            });
        })
            .on('change', async (file) => {
            const relpath = toRelativePath(file);
            if (!relpath) {
                console.log(`Can't found ${file} from sources`);
                return;
            }
            const tofile = path_1.default.join(output, relpath);
            await fs_extra_1.default.mkdirp(path_1.default.dirname(tofile));
            await fs_extra_1.default.copy(file, tofile, { dereference: false });
            observer.next({
                file: relpath,
                treat: MirrorTreat.UPDATED,
            });
        })
            .on('unlink', async (file) => {
            const relpath = toRelativePath(file);
            if (!relpath) {
                console.log(`Can't found ${file} from sources`);
                return;
            }
            const tofile = path_1.default.join(output, relpath);
            if (fs_extra_1.default.pathExistsSync(tofile)) {
                await fs_extra_1.default.remove(tofile);
                observer.next({
                    file: relpath,
                    treat: MirrorTreat.REMOVED,
                });
            }
        });
        return () => {
            watcher.close();
        };
    });
}
exports.mirrorFiles = mirrorFiles;
//# sourceMappingURL=mirrorFiles.js.map