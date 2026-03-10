/**
 * Read the "Safe Storage" password from a Linux keyring.
 *
 * Chromium browsers typically store their cookie encryption password under:
 * - service: "<Browser> Safe Storage"
 * - account: "<Browser>"
 *
 * We keep this logic in JS (no native deps) and return an empty password on failure
 * (Chromium may still have v10 cookies, and callers can use inline/export escape hatches).
 */
export declare function getLinuxChromiumSafeStoragePassword(options: any): Promise<{
    password: any;
    warnings: any[];
}>;
export declare function getLinuxChromeSafeStoragePassword(options?: {}): Promise<{
    password: any;
    warnings: any[];
}>;
