import { Observable } from 'rxjs';
interface Params {
    sources: string[];
    output: string;
    ignored?: RegExp;
}
export declare enum MirrorTreat {
    ADDED = "added",
    UPDATED = "updated",
    REMOVED = "removed"
}
export interface MirrorResult {
    treat: MirrorTreat;
    file: string;
}
export declare function mirrorFiles({ sources, output, ignored }: Params): Promise<Observable<MirrorResult>>;
export {};
