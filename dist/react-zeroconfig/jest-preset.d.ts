declare const _default: {
    transform: {
        '\\.[jt]sx?$': string;
        '\\.(yaml|yml)$': string;
    };
    moduleNameMapper: {
        '\\.(bmp|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|html|ejs|txt|md)$': string;
        '\\.(css|less|scss|sass)$': string;
    };
    testMatch: string[];
    moduleFileExtensions: string[];
    moduleDirectories: string[];
};
export = _default;
