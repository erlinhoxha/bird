export declare function parsePositiveIntFlag(raw: any, flagName: any): {
    ok: boolean;
    error: string;
    value?: undefined;
} | {
    ok: boolean;
    value: number;
    error?: undefined;
};
export declare function parseNonNegativeIntFlag(raw: any, flagName: any, defaultValue: any): {
    ok: boolean;
    error: string;
    value?: undefined;
} | {
    ok: boolean;
    value: number;
    error?: undefined;
};
export declare function parsePaginationFlags(cmdOpts: any, opts: any): {
    ok: boolean;
    error: string;
    value?: undefined;
} | {
    ok: boolean;
    value: number;
    error?: undefined;
} | {
    ok: boolean;
    usePagination: boolean;
    maxPages: number;
    cursor: any;
    pageDelayMs: any;
};
