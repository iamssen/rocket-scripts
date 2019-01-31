"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const browser_sync_1 = __importDefault(require("browser-sync"));
const rxjs_1 = require("rxjs");
module.exports = function (browserSyncConfig) {
    return rxjs_1.Observable.create((observer) => {
        browser_sync_1.default(browserSyncConfig, (error) => {
            if (error) {
                observer.error(error);
            }
            else {
                observer.next();
            }
        });
    });
};
//# sourceMappingURL=runBrowserSync.js.map