"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAppEntry = void 0;
const chokidar_1 = require("chokidar");
const react_1 = require("react");
const getAppEntry_1 = require("./getAppEntry");
function useAppEntry({ appDir }) {
    const [entry, setEntry] = react_1.useState(null);
    react_1.useEffect(() => {
        async function update() {
            const nextEntry = await getAppEntry_1.getAppEntry({ appDir });
            setEntry((prevEntry) => {
                return !prevEntry ||
                    prevEntry.length !== nextEntry.length ||
                    prevEntry.map(({ name }) => name).join('') !== nextEntry.map(({ name }) => name).join('')
                    ? nextEntry
                    : prevEntry;
            });
        }
        update();
        const watcher = chokidar_1.watch([`${appDir}/*.{js,jsx,ts,tsx}`, `${appDir}/*.html`], {
            persistent: true,
            ignoreInitial: true,
        });
        watcher.on('add', update).on('unlink', update);
        return () => {
            watcher.close();
        };
    }, [appDir]);
    return entry;
}
exports.useAppEntry = useAppEntry;
//# sourceMappingURL=useAppEntry.js.map