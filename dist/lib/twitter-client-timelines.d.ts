import { type ParsedTweet } from './twitter-client-utils.js';
interface TimelineOptions {
    cursor?: string;
    includeRaw?: boolean;
    maxPages?: number;
}
export declare function withTimelines(Base: any): {
    new (...args: any[]): {
        [x: string]: any;
        logBookmarksDebug(message: any, data: any): void;
        getBookmarksQueryIds(): Promise<any[]>;
        getBookmarkFolderQueryIds(): Promise<any[]>;
        getLikesQueryIds(): Promise<any[]>;
        /**
         * Get the authenticated user's bookmarks
         */
        getBookmarks(count?: number, options?: TimelineOptions): Promise<{
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
        getAllBookmarks(options?: TimelineOptions): Promise<{
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
         * Get the authenticated user's liked tweets
         */
        getLikes(count?: number, options?: TimelineOptions): Promise<{
            success: boolean;
            error: any;
            tweets?: undefined;
            nextCursor?: undefined;
        } | {
            success: boolean;
            tweets: ParsedTweet[];
            nextCursor: string;
            error?: undefined;
        }>;
        getAllLikes(options?: TimelineOptions): Promise<{
            success: boolean;
            error: any;
            tweets?: undefined;
            nextCursor?: undefined;
        } | {
            success: boolean;
            tweets: ParsedTweet[];
            nextCursor: string;
            error?: undefined;
        }>;
        getLikesPaged(limit: any, options?: TimelineOptions): Promise<{
            success: boolean;
            error: any;
            tweets?: undefined;
            nextCursor?: undefined;
        } | {
            success: boolean;
            tweets: ParsedTweet[];
            nextCursor: string;
            error?: undefined;
        }>;
        /**
         * Get the authenticated user's bookmark folder timeline
         */
        getBookmarkFolderTimeline(folderId: any, count?: number, options?: TimelineOptions): Promise<{
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
        getAllBookmarkFolderTimeline(folderId: any, options?: TimelineOptions): Promise<{
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
        getBookmarksPaged(limit: any, options?: TimelineOptions): Promise<{
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
        getBookmarkFolderTimelinePaged(folderId: any, limit: any, options?: TimelineOptions): Promise<{
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
        fetchWithRetry(url: any, init: RequestInit): Promise<any>;
    };
    [x: string]: any;
};
export {};
