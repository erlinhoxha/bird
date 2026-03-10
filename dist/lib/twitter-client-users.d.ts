import type { CurrentUserResult, TwitterJsonHeaders } from './twitter-client-base.js';
type Constructor<T = object> = abstract new (...args: any[]) => T;
interface RestUserRecord {
    id_str?: string;
    id?: string | number;
    screen_name?: string;
    name?: string;
    description?: string;
    followers_count?: number;
    friends_count?: number;
    verified?: boolean;
    profile_image_url_https?: string;
    created_at?: string;
}
export interface TwitterUserProfile {
    id: string;
    username: string;
    name: string;
    description?: string;
    followersCount?: number;
    followingCount?: number;
    isBlueVerified?: boolean;
    profileImageUrl?: string;
    createdAt?: string;
}
export interface UserListSuccessResult {
    success: true;
    users: TwitterUserProfile[];
    nextCursor?: string;
}
export interface UserListFailureResult {
    success: false;
    error: string;
}
type UserListResult = UserListSuccessResult | UserListFailureResult;
interface UsersCapable {
    getQueryId(operationName: 'Following' | 'Followers'): Promise<string>;
    fetchWithTimeout(url: string, init?: RequestInit): Promise<Response>;
    getHeaders(): TwitterJsonHeaders;
    withRefreshedQueryIdsOn404<TAttemptResult extends {
        success?: boolean;
        had404?: boolean;
    }>(attempt: () => Promise<TAttemptResult>): Promise<{
        result: TAttemptResult;
        refreshed: boolean;
    }>;
    cookieHeader: string;
    userAgent: string;
    clientUserId?: string;
}
export declare function withUsers<TBase extends Constructor<UsersCapable>>(Base: TBase): (abstract new (...args: any[]) => {
    getFollowingQueryIds(): Promise<string[]>;
    getFollowersQueryIds(): Promise<string[]>;
    parseUsersFromRestResponse(users?: RestUserRecord[]): TwitterUserProfile[];
    getFollowersViaRest(userId: string, count: number, cursor?: string): Promise<UserListResult>;
    getFollowingViaRest(userId: string, count: number, cursor?: string): Promise<UserListResult>;
    getCurrentUser(): Promise<CurrentUserResult>;
    getFollowing(userId: string, count?: number, cursor?: string): Promise<UserListResult>;
    getFollowers(userId: string, count?: number, cursor?: string): Promise<UserListResult>;
    getQueryId(operationName: "Following" | "Followers"): Promise<string>;
    fetchWithTimeout(url: string, init?: RequestInit): Promise<Response>;
    getHeaders(): TwitterJsonHeaders;
    withRefreshedQueryIdsOn404<TAttemptResult extends {
        success?: boolean;
        had404?: boolean;
    }>(attempt: () => Promise<TAttemptResult>): Promise<{
        result: TAttemptResult;
        refreshed: boolean;
    }>;
    cookieHeader: string;
    userAgent: string;
    clientUserId?: string;
}) & TBase;
export {};
