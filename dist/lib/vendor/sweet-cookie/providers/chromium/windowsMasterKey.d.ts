export declare function getWindowsChromiumMasterKey(userDataDir: any, label: any): Promise<{
    ok: boolean;
    error: string;
    value?: undefined;
} | {
    ok: boolean;
    value: Buffer<ArrayBuffer>;
    error?: undefined;
}>;
