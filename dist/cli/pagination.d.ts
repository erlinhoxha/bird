export interface PositiveIntParseFailure {
    ok: false;
    error: string;
}
export interface PositiveIntParseSuccess {
    ok: true;
    value: number | undefined;
}
export type PositiveIntParseResult = PositiveIntParseFailure | PositiveIntParseSuccess;
export interface NonNegativeIntParseSuccess {
    ok: true;
    value: number;
}
export type NonNegativeIntParseResult = PositiveIntParseFailure | NonNegativeIntParseSuccess;
export interface PaginationFlagInput {
    all?: boolean;
    cursor?: string;
    maxPages?: string;
    delay?: string;
}
export interface PaginationFlagOptions {
    maxPagesImpliesPagination?: boolean;
    includeDelay?: boolean;
    defaultDelayMs?: number;
}
export interface PaginationFlagsSuccess {
    ok: true;
    usePagination: boolean;
    maxPages?: number;
    cursor?: string;
    pageDelayMs?: number;
}
export type PaginationFlagsResult = PositiveIntParseFailure | PaginationFlagsSuccess;
export declare function isPaginationFlagsFailure(result: PaginationFlagsResult): result is PositiveIntParseFailure;
export declare function parsePositiveIntFlag(raw: string | undefined, flagName: string): PositiveIntParseResult;
export declare function parseNonNegativeIntFlag(raw: string | undefined, flagName: string, defaultValue: number): NonNegativeIntParseResult;
export declare function parsePaginationFlags(cmdOpts: PaginationFlagInput, opts?: PaginationFlagOptions): PaginationFlagsResult;
