export declare function withFollow(Base: any): {
    new (...args: any[]): {
        [x: string]: any;
        /**
         * Follow a user by their user ID
         */
        follow(userId: any): Promise<{
            success: boolean;
            userId?: undefined;
            username?: undefined;
            error?: undefined;
        } | {
            success: boolean;
            userId: any;
            username: any;
            error?: undefined;
        } | {
            success: boolean;
            error: any;
            userId?: undefined;
            username?: undefined;
        }>;
        /**
         * Unfollow a user by their user ID
         */
        unfollow(userId: any): Promise<{
            success: boolean;
            userId?: undefined;
            username?: undefined;
            error?: undefined;
        } | {
            success: boolean;
            userId: any;
            username: any;
            error?: undefined;
        } | {
            success: boolean;
            error: any;
            userId?: undefined;
            username?: undefined;
        }>;
        followViaRest(userId: any, action: any): Promise<{
            success: boolean;
            userId?: undefined;
            username?: undefined;
            error?: undefined;
        } | {
            success: boolean;
            userId: any;
            username: any;
            error?: undefined;
        } | {
            success: boolean;
            error: any;
            userId?: undefined;
            username?: undefined;
        }>;
        followViaGraphQL(userId: any, follow: any): Promise<{
            success: boolean;
            userId: any;
            username: any;
            error?: undefined;
        } | {
            success: boolean;
            error: any;
            userId?: undefined;
            username?: undefined;
        }>;
        getFollowQueryIds(follow: any): Promise<any[]>;
    };
    [x: string]: any;
};
