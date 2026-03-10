import { type ParsedTweet } from './twitter-client-utils.js';
interface HomeTimelineOptions {
    includeRaw?: boolean;
}
export declare function withHome(Base: any): {
    new (...args: any[]): {
        [x: string]: any;
        getHomeTimelineQueryIds(): Promise<any[]>;
        getHomeLatestTimelineQueryIds(): Promise<any[]>;
        /**
         * Get the authenticated user's "For You" home timeline
         */
        getHomeTimeline(count?: number, options?: HomeTimelineOptions): Promise<{
            success: boolean;
            error: string;
            tweets?: undefined;
        } | {
            success: boolean;
            tweets: ParsedTweet[];
            error?: undefined;
        }>;
        /**
         * Get the authenticated user's "Following" (latest/chronological) home timeline
         */
        getHomeLatestTimeline(count?: number, options?: HomeTimelineOptions): Promise<{
            success: boolean;
            error: string;
            tweets?: undefined;
        } | {
            success: boolean;
            tweets: ParsedTweet[];
            error?: undefined;
        }>;
        fetchHomeTimeline(operation: any, count: any, options: HomeTimelineOptions): Promise<{
            success: boolean;
            error: string;
            tweets?: undefined;
        } | {
            success: boolean;
            tweets: ParsedTweet[];
            error?: undefined;
        }>;
    };
    [x: string]: any;
};
export {};
