export declare function withEngagement(Base: any): {
    new (...args: any[]): {
        [x: string]: any;
        performEngagementMutation(operationName: any, tweetId: any): Promise<{
            success: boolean;
            error: any;
        } | {
            success: boolean;
            error?: undefined;
        }>;
        /** Like a tweet. */
        like(tweetId: any): Promise<{
            success: boolean;
            error: any;
        } | {
            success: boolean;
            error?: undefined;
        }>;
        /** Remove a like from a tweet. */
        unlike(tweetId: any): Promise<{
            success: boolean;
            error: any;
        } | {
            success: boolean;
            error?: undefined;
        }>;
        /** Retweet a tweet. */
        retweet(tweetId: any): Promise<{
            success: boolean;
            error: any;
        } | {
            success: boolean;
            error?: undefined;
        }>;
        /** Remove a retweet. */
        unretweet(tweetId: any): Promise<{
            success: boolean;
            error: any;
        } | {
            success: boolean;
            error?: undefined;
        }>;
        /** Bookmark a tweet. */
        bookmark(tweetId: any): Promise<{
            success: boolean;
            error: any;
        } | {
            success: boolean;
            error?: undefined;
        }>;
    };
    [x: string]: any;
};
