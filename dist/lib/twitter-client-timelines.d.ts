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
        getBookmarks(count?: number, options?: {}): Promise<{
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
        getAllBookmarks(options: any): Promise<{
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
         * Get the authenticated user's liked tweets
         */
        getLikes(count?: number, options?: {}): Promise<{
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
        getAllLikes(options: any): Promise<{
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
        getLikesPaged(limit: any, options?: {}): Promise<{
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
         * Get the authenticated user's bookmark folder timeline
         */
        getBookmarkFolderTimeline(folderId: any, count?: number, options?: {}): Promise<{
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
        getAllBookmarkFolderTimeline(folderId: any, options: any): Promise<{
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
        getBookmarksPaged(limit: any, options?: {}): Promise<{
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
        getBookmarkFolderTimelinePaged(folderId: any, limit: any, options?: {}): Promise<{
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
        fetchWithRetry(url: any, init: any): Promise<any>;
    };
    [x: string]: any;
};
