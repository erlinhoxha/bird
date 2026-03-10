export declare function withUserTweets(Base: any): {
    new (...args: any[]): {
        [x: string]: any;
        getUserTweetsQueryIds(): Promise<any[]>;
        /**
         * Get tweets from a user's profile timeline (single page).
         */
        getUserTweets(userId: any, count?: number, options?: {}): Promise<{
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
         * Get tweets from a user's profile timeline with pagination support.
         */
        getUserTweetsPaged(userId: any, limit: any, options?: {}): Promise<{
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
