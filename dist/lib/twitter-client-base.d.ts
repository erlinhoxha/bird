import { QUERY_IDS } from './twitter-client-constants.js';
type QueryIdOperation = keyof typeof QUERY_IDS;
export interface TwitterClientCookies {
    authToken: string;
    ct0: string;
    cookieHeader?: string | null;
}
export interface TwitterClientBaseOptions {
    cookies: TwitterClientCookies;
    userAgent?: string;
    timeoutMs?: number;
    quoteDepth?: number;
}
export interface CurrentUser {
    id: string;
    username: string;
    name: string;
}
export interface CurrentUserSuccessResult {
    success: true;
    user: CurrentUser;
}
export interface CurrentUserFailureResult {
    success: false;
    error: string;
}
export type CurrentUserResult = CurrentUserSuccessResult | CurrentUserFailureResult;
export interface QueryRefreshAttemptResult {
    success?: boolean;
    had404?: boolean;
}
export interface QueryRefreshAttemptOutcome<TAttemptResult> {
    result: TAttemptResult;
    refreshed: boolean;
}
export interface TwitterBaseHeaders {
    accept: string;
    'accept-language': string;
    authorization: string;
    'x-csrf-token': string;
    'x-twitter-auth-type': string;
    'x-twitter-active-user': string;
    'x-twitter-client-language': string;
    'x-client-uuid': string;
    'x-twitter-client-deviceid': string;
    cookie: string;
    'user-agent': string;
    'sec-ch-ua': string;
    'sec-ch-ua-mobile': string;
    'sec-ch-ua-platform': string;
    'sec-fetch-dest': string;
    'sec-fetch-mode': string;
    'sec-fetch-site': string;
    priority: string;
    origin: string;
    referer: string;
    'x-twitter-client-user-id'?: string;
}
export interface TwitterJsonHeaders extends TwitterBaseHeaders {
    'content-type': 'application/json';
}
export declare class TwitterClientBase {
    authToken: string;
    ct0: string;
    cookieHeader: string;
    userAgent: string;
    timeoutMs?: number;
    quoteDepth: number;
    clientUuid: string;
    clientDeviceId: string;
    clientUserId?: string;
    constructor(options: TwitterClientBaseOptions);
    protected getCurrentUser(): Promise<CurrentUserResult>;
    sleep(ms: number): Promise<void>;
    getQueryId(operationName: QueryIdOperation): Promise<string>;
    refreshQueryIds(): Promise<void>;
    withRefreshedQueryIdsOn404<TAttemptResult extends QueryRefreshAttemptResult>(attempt: () => Promise<TAttemptResult>): Promise<QueryRefreshAttemptOutcome<TAttemptResult>>;
    getTweetDetailQueryIds(): Promise<string[]>;
    getSearchTimelineQueryIds(): Promise<string[]>;
    fetchWithTimeout(url: string, init?: RequestInit): Promise<Response>;
    getHeaders(): TwitterJsonHeaders;
    createTransactionId(): string;
    getBaseHeaders(): TwitterBaseHeaders;
    getJsonHeaders(): TwitterJsonHeaders;
    getUploadHeaders(): TwitterBaseHeaders;
    ensureClientUserId(): Promise<void>;
}
export {};
