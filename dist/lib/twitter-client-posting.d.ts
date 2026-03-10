export declare function withPosting(Base: any): {
    new (...args: any[]): {
        [x: string]: any;
        /**
         * Post a new tweet
         */
        tweet(text: any, mediaIds: any): Promise<{
            success: boolean;
            error: any;
            tweetId?: undefined;
        } | {
            success: boolean;
            tweetId: any;
            error?: undefined;
        }>;
        /**
         * Reply to an existing tweet
         */
        reply(text: any, replyToTweetId: any, mediaIds: any): Promise<{
            success: boolean;
            error: any;
            tweetId?: undefined;
        } | {
            success: boolean;
            tweetId: any;
            error?: undefined;
        }>;
        createTweet(variables: any, features: any): Promise<{
            success: boolean;
            error: any;
            tweetId?: undefined;
        } | {
            success: boolean;
            tweetId: any;
            error?: undefined;
        }>;
        formatErrors(errors: any): any;
        statusUpdateInputFromCreateTweetVariables(variables: any): {
            text: any;
            inReplyToTweetId: any;
            mediaIds: string[];
        };
        postStatusUpdate(input: any): Promise<{
            success: boolean;
            error: any;
            tweetId?: undefined;
        } | {
            success: boolean;
            tweetId: any;
            error?: undefined;
        }>;
        tryStatusUpdateFallback(errors: any, variables: any): Promise<{
            success: boolean;
            error: any;
            tweetId?: undefined;
        } | {
            success: boolean;
            tweetId: any;
            error?: undefined;
        }>;
    };
    [x: string]: any;
};
