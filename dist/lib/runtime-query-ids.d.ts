export declare function createRuntimeQueryIdStore(options?: {}): {
    cachePath: any;
    ttlMs: any;
    getSnapshotInfo: () => Promise<{
        snapshot: any;
        cachePath: any;
        ageMs: number;
        isFresh: boolean;
    }>;
    getQueryId: (operationName: any) => Promise<any>;
    refresh: (operationNames: any, opts?: {}) => Promise<any>;
    clearMemory(): void;
};
export declare const runtimeQueryIds: {
    cachePath: any;
    ttlMs: any;
    getSnapshotInfo: () => Promise<{
        snapshot: any;
        cachePath: any;
        ageMs: number;
        isFresh: boolean;
    }>;
    getQueryId: (operationName: any) => Promise<any>;
    refresh: (operationNames: any, opts?: {}) => Promise<any>;
    clearMemory(): void;
};
