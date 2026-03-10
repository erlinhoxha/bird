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
function isPositiveIntParseFailure(result: PositiveIntParseResult): result is PositiveIntParseFailure {
    return result.ok === false;
}
function isNonNegativeIntParseFailure(result: NonNegativeIntParseResult): result is PositiveIntParseFailure {
    return result.ok === false;
}
export function isPaginationFlagsFailure(result: PaginationFlagsResult): result is PositiveIntParseFailure {
    return result.ok === false;
}
export function parsePositiveIntFlag(raw: string | undefined, flagName: string): PositiveIntParseResult {
    if (raw === undefined) {
        return { ok: true, value: undefined };
    }
    const value = Number.parseInt(raw, 10);
    if (!Number.isFinite(value) || value <= 0) {
        return { ok: false, error: `Invalid ${flagName}. Expected a positive integer.` };
    }
    return { ok: true, value };
}
export function parseNonNegativeIntFlag(raw: string | undefined, flagName: string, defaultValue: number): NonNegativeIntParseResult {
    const value = Number.parseInt(raw ?? String(defaultValue), 10);
    if (!Number.isFinite(value) || value < 0) {
        return { ok: false, error: `Invalid ${flagName}. Expected a non-negative integer.` };
    }
    return { ok: true, value };
}
export function parsePaginationFlags(cmdOpts: PaginationFlagInput, opts: PaginationFlagOptions = {}): PaginationFlagsResult {
    const maxPagesImpliesPagination = opts?.maxPagesImpliesPagination ?? false;
    const includeDelay = opts?.includeDelay ?? false;
    const defaultDelayMs = opts?.defaultDelayMs ?? 1000;
    const maxPages = parsePositiveIntFlag(cmdOpts.maxPages, '--max-pages');
    if (isPositiveIntParseFailure(maxPages)) {
        return { ok: false, error: maxPages.error };
    }
    const usePagination = Boolean(cmdOpts.all || cmdOpts.cursor || (maxPagesImpliesPagination && maxPages.value !== undefined));
    let pageDelayMs;
    if (includeDelay) {
        const delay = parseNonNegativeIntFlag(cmdOpts.delay, '--delay', defaultDelayMs);
        if (isNonNegativeIntParseFailure(delay)) {
            return { ok: false, error: delay.error };
        }
        pageDelayMs = delay.value;
    }
    return {
        ok: true,
        usePagination,
        maxPages: maxPages.value,
        cursor: cmdOpts.cursor,
        pageDelayMs,
    };
}
//# sourceMappingURL=pagination.js.map
