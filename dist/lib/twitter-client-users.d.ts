export declare function withUsers(Base: any): {
    new (...args: any[]): {
        [x: string]: any;
        getFollowingQueryIds(): Promise<any[]>;
        getFollowersQueryIds(): Promise<any[]>;
        parseUsersFromRestResponse(users: any): any;
        getFollowersViaRest(userId: any, count: any, cursor: any): Promise<{
            success: boolean;
            users: any;
            nextCursor: any;
            error?: undefined;
        } | {
            success: boolean;
            error: any;
            users?: undefined;
            nextCursor?: undefined;
        }>;
        getFollowingViaRest(userId: any, count: any, cursor: any): Promise<{
            success: boolean;
            users: any;
            nextCursor: any;
            error?: undefined;
        } | {
            success: boolean;
            error: any;
            users?: undefined;
            nextCursor?: undefined;
        }>;
        /**
         * Fetch the account associated with the current cookies
         */
        getCurrentUser(): Promise<{
            success: boolean;
            user: {
                id: any;
                username: any;
                name: any;
            };
            error?: undefined;
        } | {
            success: boolean;
            error: any;
            user?: undefined;
        }>;
        /**
         * Get users that a user is following
         */
        getFollowing(userId: any, count: number, cursor: any): Promise<{
            success: boolean;
            users: any;
            nextCursor: any;
            error?: undefined;
        } | {
            success: boolean;
            error: any;
            users?: undefined;
            nextCursor?: undefined;
        }>;
        /**
         * Get users that follow a user
         */
        getFollowers(userId: any, count: number, cursor: any): Promise<{
            success: boolean;
            users: any;
            nextCursor: any;
            error?: undefined;
        } | {
            success: boolean;
            error: any;
            users?: undefined;
            nextCursor?: undefined;
        }>;
    };
    [x: string]: any;
};
