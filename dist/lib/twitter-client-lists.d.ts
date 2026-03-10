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
        getListTimeline(listId: any, count?: number, options?: {}): Promise<{
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
         * Get all tweets from a list timeline (paginated)
         */
        getAllListTimeline(listId: any, options: any): Promise<{
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
         * Internal paginated list timeline fetcher
         */
        getListTimelinePaged(listId: any, limit: any, options?: {}): Promise<{
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
