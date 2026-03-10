import { type ParsedTweet } from './twitter-client-utils.js';
interface SearchTimelineOptions {
    cursor?: string;
    includeRaw?: boolean;
    maxPages?: number;
}
export declare function withSearch(Base: any): {
    new (...args: any[]): {
        [x: string]: any;
        /**
         * Search for tweets matching a query
         */
        search(query: any, count?: number, options?: SearchTimelineOptions): Promise<{
            success: boolean;
            error: string;
            tweets?: undefined;
            nextCursor?: undefined;
        } | {
            success: boolean;
            tweets: ParsedTweet[];
            nextCursor: string;
            error?: undefined;
        }>;
        /**
         * Get all search results (paged)
         */
        getAllSearchResults(query: any, options?: SearchTimelineOptions): Promise<{
            success: boolean;
            error: string;
            tweets?: undefined;
            nextCursor?: undefined;
        } | {
            success: boolean;
            tweets: ParsedTweet[];
            nextCursor: string;
            error?: undefined;
        }>;
        searchPaged(query: any, limit: any, options?: SearchTimelineOptions): Promise<{
            success: boolean;
            error: string;
            tweets?: undefined;
            nextCursor?: undefined;
        } | {
            success: boolean;
            tweets: ParsedTweet[];
            nextCursor: string;
            error?: undefined;
        }>;
    };
    [x: string]: any;
};
export {};
