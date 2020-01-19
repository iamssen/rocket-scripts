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
    file: string;
    treat: MirrorTreat;
}
export declare function mirrorFiles({ sources, output, ignored }: Params): Promise<Observable<MirrorResult>>;
export {};
