import { type ParsedTweet } from './twitter-client-utils.js';
interface ListTimelineOptions {
    cursor?: string;
    includeRaw?: boolean;
    maxPages?: number;
}
export declare function withLists(Base: any): {
    new (...args: any[]): {
        [x: string]: any;
        getListOwnershipsQueryIds(): Promise<any[]>;
        getListMembershipsQueryIds(): Promise<any[]>;
        getListTimelineQueryIds(): Promise<any[]>;
        /**
         * Get lists owned by the authenticated user
         */
        getOwnedLists(count?: number): Promise<{
            success: boolean;
            error: any;
            lists?: undefined;
        } | {
            success: boolean;
            lists: any[];
            error?: undefined;
        }>;
        /**
         * Get lists the authenticated user is a member of
         */
        getListMemberships(count?: number): Promise<{
            success: boolean;
            error: any;
            lists?: undefined;
        } | {
            success: boolean;
            lists: any[];
            error?: undefined;
        }>;
        /**
         * Get tweets from a list timeline
         */
        getListTimeline(listId: any, count?: number, options?: ListTimelineOptions): Promise<{
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
         * Get all tweets from a list timeline (paginated)
         */
        getAllListTimeline(listId: any, options?: ListTimelineOptions): Promise<{
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
         * Internal paginated list timeline fetcher
         */
        getListTimelinePaged(listId: any, limit: any, options?: ListTimelineOptions): Promise<{
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
