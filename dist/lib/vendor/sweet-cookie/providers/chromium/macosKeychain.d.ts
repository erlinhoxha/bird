export declare function readKeychainGenericPassword(options: any): Promise<{
    ok: boolean;
    password: any;
    error?: undefined;
} | {
    ok: boolean;
    error: string;
    password?: undefined;
}>;
export declare function readKeychainGenericPasswordFirst(options: any): Promise<{
    ok: boolean;
    password: any;
    error?: undefined;
} | {
    ok: boolean;
    error: string;
    password?: undefined;
}>;
