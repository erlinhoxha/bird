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
export interface PaginateCursorOptions<T> {
    cursor?: string;
    maxPages?: number;
    pageDelayMs?: number;
    sleep(ms: number): Promise<void>;
    fetchPage(cursor?: string): Promise<PaginatedFetchResult<T>>;
    getKey(item: T): string;
}
export declare function paginateCursor<T>(opts: PaginateCursorOptions<T>): Promise<PaginateCursorResult<T>>;
