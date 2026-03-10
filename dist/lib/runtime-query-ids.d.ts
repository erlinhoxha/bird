type FetchLike = typeof fetch;
type QueryIdMap = Record<string, string>;
interface QueryIdDiscovery {
    pages: string[];
    bundles: string[];
}
export interface RuntimeQueryIdSnapshot {
    fetchedAt: string;
    ttlMs: number;
    ids: QueryIdMap;
    discovery: QueryIdDiscovery;
}
export interface RuntimeQueryIdSnapshotInfo {
    snapshot: RuntimeQueryIdSnapshot;
    cachePath: string;
    ageMs: number;
    isFresh: boolean;
}
export interface RuntimeQueryIdStoreOptions {
    fetchImpl?: FetchLike;
    ttlMs?: number;
    cachePath?: string;
}
interface RefreshOptions {
    force?: boolean;
}
export interface RuntimeQueryIdStore {
    cachePath: string;
    ttlMs: number;
    getSnapshotInfo(): Promise<RuntimeQueryIdSnapshotInfo | null>;
    getQueryId(operationName: string): Promise<string | null>;
    refresh(operationNames: string[], opts?: RefreshOptions): Promise<RuntimeQueryIdSnapshotInfo | null>;
    clearMemory(): void;
}
export declare function createRuntimeQueryIdStore(options?: RuntimeQueryIdStoreOptions): RuntimeQueryIdStore;
export declare const runtimeQueryIds: RuntimeQueryIdStore;
export {};
