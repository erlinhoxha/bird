export interface PaginatedFetchSuccess<T> {
    success: true;
    items: T[];
    cursor?: string;
}
export interface PaginatedFetchFailure<T> {
    success: false;
    error: string;
    items?: T[];
    nextCursor?: string;
}
export type PaginatedFetchResult<T> = PaginatedFetchSuccess<T> | PaginatedFetchFailure<T>;
export interface PaginateCursorSuccess<T> {
    success: true;
    items: T[];
    nextCursor?: string;
}
export interface PaginateCursorFailure<T> {
    success: false;
    error: string;
    items?: T[];
    nextCursor?: string;
}
export type PaginateCursorResult<T> = PaginateCursorSuccess<T> | PaginateCursorFailure<T>;
function isPaginatedFetchFailure<T>(page: PaginatedFetchResult<T>): page is PaginatedFetchFailure<T> {
    return page.success === false;
}
export interface PaginateCursorOptions<T> {
    cursor?: string;
    maxPages?: number;
    pageDelayMs?: number;
    sleep(ms: number): Promise<void>;
    fetchPage(cursor?: string): Promise<PaginatedFetchResult<T>>;
    getKey(item: T): string;
}
export async function paginateCursor<T>(opts: PaginateCursorOptions<T>): Promise<PaginateCursorResult<T>> {
    const { maxPages, pageDelayMs = 1000 } = opts;
    const seen = new Set<string>();
    const items: T[] = [];
    let cursor = opts.cursor;
    let pagesFetched = 0;
    while (true) {
        if (pagesFetched > 0 && pageDelayMs > 0) {
            await opts.sleep(pageDelayMs);
        }
        const page = await opts.fetchPage(cursor);
        if (isPaginatedFetchFailure(page)) {
            if (items.length > 0) {
                return { success: false, error: page.error, items, nextCursor: cursor };
            }
            return page;
        }
        pagesFetched += 1;
        for (const item of page.items) {
            const key = opts.getKey(item);
            if (seen.has(key)) {
                continue;
            }
            seen.add(key);
            items.push(item);
        }
        const pageCursor = page.cursor;
        if (!pageCursor || pageCursor === cursor) {
            return { success: true, items, nextCursor: undefined };
        }
        if (maxPages !== undefined && pagesFetched >= maxPages) {
            return { success: true, items, nextCursor: pageCursor };
        }
        cursor = pageCursor;
    }
}
//# sourceMappingURL=paginate-cursor.js.map
