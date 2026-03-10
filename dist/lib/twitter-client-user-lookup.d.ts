export declare function withUserLookup(Base: any): {
    new (...args: any[]): {
        [x: string]: any;
        getUserByScreenNameGraphQL(screenName: any): Promise<{
            success: boolean;
            userId: any;
            username: any;
            name: any;
            error?: undefined;
        } | {
            success: boolean;
            error: any;
            userId?: undefined;
            username?: undefined;
            name?: undefined;
        }>;
        /**
         * Look up a user's ID by their username/handle.
         * Uses GraphQL UserByScreenName first, then falls back to REST on transient failures.
         */
        getUserIdByUsername(username: any): Promise<{
            success: boolean;
            userId: any;
            username: any;
            name: any;
            error?: undefined;
        } | {
            success: boolean;
            error: any;
            userId?: undefined;
            username?: undefined;
            name?: undefined;
        }>;
        getAboutAccountQueryIds(): Promise<any[]>;
        /**
         * Get account origin and location information for a user.
         * Returns data from Twitter's "About this account" feature.
         */
        getUserAboutAccount(username: any): Promise<{
            success: boolean;
            aboutProfile: any;
            error?: undefined;
        } | {
            success: boolean;
            error: any;
            aboutProfile?: undefined;
        }>;
    };
    [x: string]: any;
};
