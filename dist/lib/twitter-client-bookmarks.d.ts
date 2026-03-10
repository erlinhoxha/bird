export declare function withBookmarks(Base: any): {
    new (...args: any[]): {
        [x: string]: any;
        unbookmark(tweetId: any): Promise<{
            success: boolean;
            error: any;
        } | {
            success: boolean;
            error?: undefined;
        }>;
    };
    [x: string]: any;
};
