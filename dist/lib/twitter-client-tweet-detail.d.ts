import { type ParsedTweet } from './twitter-client-utils.js';
interface TweetDetailOptions {
    includeRaw?: boolean;
    cursor?: string;
    maxPages?: number;
    pageDelayMs?: number;
}
export declare function withTweetDetails(Base: any): {
    new (...args: any[]): {
        [x: string]: any;
        fetchUserArticlePlainText(userId: any, tweetId: any): Promise<{
            title?: undefined;
            plainText?: undefined;
        } | {
            title: string;
            plainText: string;
        }>;
        fetchTweetDetail(tweetId: any, cursor?: string): Promise<{
            success: boolean;
            error: any;
            data?: undefined;
        } | {
            success: boolean;
            data: any;
            error?: undefined;
        }>;
        /**
         * Get tweet details by ID
         */
        getTweet(tweetId: any, options?: TweetDetailOptions): Promise<{
            success: boolean;
            error: any;
            data?: undefined;
        } | {
            success: boolean;
            data: any;
            error?: undefined;
        } | {
            success: boolean;
            tweet: ParsedTweet;
        }>;
        /**
         * Get replies to a tweet by ID
         */
        getReplies(tweetId: any, options?: TweetDetailOptions): Promise<{
            success: boolean;
            error: any;
            data?: undefined;
        } | {
            success: boolean;
            data: any;
            error?: undefined;
        } | {
            success: boolean;
            tweets: ParsedTweet[];
        }>;
        /**
         * Get full conversation thread for a tweet ID
         */
        getThread(tweetId: any, options?: TweetDetailOptions): Promise<{
            success: boolean;
            error: any;
            data?: undefined;
        } | {
            success: boolean;
            data: any;
            error?: undefined;
        } | {
            success: boolean;
            tweets: ParsedTweet[];
        }>;
        /**
         * Get replies to a tweet with pagination support
         */
        getRepliesPaged(tweetId: any, options?: TweetDetailOptions): Promise<{
            success: boolean;
            tweets: ParsedTweet[];
            nextCursor: string;
            error?: undefined;
        } | {
            success: boolean;
            tweets: ParsedTweet[];
            nextCursor: string;
            error: string;
        } | {
            success: boolean;
            error: string;
            tweets?: undefined;
            nextCursor?: undefined;
        }>;
        /**
         * Get full conversation thread with pagination support
         */
        getThreadPaged(tweetId: any, options?: TweetDetailOptions): Promise<{
            success: boolean;
            tweets: ParsedTweet[];
            nextCursor: string;
            error?: undefined;
        } | {
            success: boolean;
            tweets: ParsedTweet[];
            nextCursor: string;
            error: string;
        } | {
            success: boolean;
            error: string;
            tweets?: undefined;
            nextCursor?: undefined;
        }>;
    };
    [x: string]: any;
};
export {};
