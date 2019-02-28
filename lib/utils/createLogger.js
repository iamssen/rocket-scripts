"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:no-any
function createLogger() {
    const messages = [];
    function log(...message) {
        messages.push(message);
    }
    function flush() {
        for (const message of messages) {
            console.log(...message);
        }
        messages.length = 0;
    }
    return { log, flush };
}
exports.createLogger = createLogger;
//# sourceMappingURL=createLogger.js.map