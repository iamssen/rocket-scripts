"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//tslint:disable-next-line:no-any
function takeLatest(value) {
    return Array.isArray(value) ? value.pop() : value;
}
exports.takeLatest = takeLatest;
//# sourceMappingURL=takeMinimistLatestValue.js.map