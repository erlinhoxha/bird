export declare function dpapiUnprotect(data: any, options?: {}): Promise<{
    ok: boolean;
    error: any;
    value?: undefined;
} | {
    ok: boolean;
    value: Buffer<ArrayBuffer>;
    error?: undefined;
}>;
