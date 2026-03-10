export declare function withHome(Base: any): {
    new (...args: any[]): {
        [x: string]: any;
        getHomeTimelineQueryIds(): Promise<any[]>;
        getHomeLatestTimelineQueryIds(): Promise<any[]>;
        /**
         * Get the authenticated user's "For You" home timeline
         */
        getHomeTimeline(count?: number, options?: {}): Promise<{
            success: boolean;
            error: any;
            tweets?: undefined;
        } | {
            success: boolean;
            tweets: any[];
            error?: undefined;
        }>;
        /**
         * Get the authenticated user's "Following" (latest/chronological) home timeline
         */
        getHomeLatestTimeline(count?: number, options?: {}): Promise<{
            success: boolean;
            error: any;
            tweets?: undefined;
        } | {
            success: boolean;
            tweets: any[];
            error?: undefined;
        }>;
        fetchHomeTimeline(operation: any, count: any, options: any): Promise<{
            success: boolean;
            error: any;
            tweets?: undefined;
        } | {
            success: boolean;
            tweets: any[];
            error?: undefined;
        }>;
    };
    [x: string]: any;
};
