import { type ParsedTweet } from './twitter-client-utils.js';
interface UserTweetsOptions {
    cursor?: string;
    includeRaw?: boolean;
    maxPages?: number;
    pageDelayMs?: number;
}
export declare function withUserTweets(Base: any): {
    new (...args: any[]): {
        [x: string]: any;
        getUserTweetsQueryIds(): Promise<any[]>;
        /**
         * Get tweets from a user's profile timeline (single page).
         */
        getUserTweets(userId: any, count?: number, options?: UserTweetsOptions): Promise<{
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
         * Get tweets from a user's profile timeline with pagination support.
         */
        getUserTweetsPaged(userId: any, limit: any, options?: UserTweetsOptions): Promise<{
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
