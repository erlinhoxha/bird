export declare function withSearch(Base: any): {
    new (...args: any[]): {
        [x: string]: any;
        /**
         * Search for tweets matching a query
         */
        search(query: any, count?: number, options?: {}): Promise<{
            success: boolean;
            error: any;
            tweets?: undefined;
            nextCursor?: undefined;
        } | {
            success: boolean;
            tweets: any[];
            nextCursor: any;
            error?: undefined;
        }>;
        /**
         * Get all search results (paged)
         */
        getAllSearchResults(query: any, options: any): Promise<{
            success: boolean;
            error: any;
            tweets?: undefined;
            nextCursor?: undefined;
        } | {
            success: boolean;
            tweets: any[];
            nextCursor: any;
            error?: undefined;
        }>;
        searchPaged(query: any, limit: any, options?: {}): Promise<{
            success: boolean;
            error: any;
            tweets?: undefined;
            nextCursor?: undefined;
        } | {
            success: boolean;
            tweets: any[];
            nextCursor: any;
            error?: undefined;
        }>;
    };
    [x: string]: any;
};
