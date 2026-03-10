export declare function extractCookiesFromSafari(): Promise<{
    cookies: {
        authToken: any;
        ct0: any;
        cookieHeader: any;
        source: any;
    };
    warnings: any[];
}>;
export declare function extractCookiesFromChrome(profile: any): Promise<{
    cookies: {
        authToken: any;
        ct0: any;
        cookieHeader: any;
        source: any;
    };
    warnings: any[];
}>;
export declare function extractCookiesFromFirefox(profile: any): Promise<{
    cookies: {
        authToken: any;
        ct0: any;
        cookieHeader: any;
        source: any;
    };
    warnings: any[];
}>;
/**
 * Resolve Twitter credentials from multiple sources.
 * Priority: CLI args > environment variables > browsers (ordered).
 */
export declare function resolveCredentials(options: any): Promise<{
    cookies: {
        authToken: any;
        ct0: any;
        cookieHeader: any;
        source: any;
    };
    warnings: any[];
}>;
