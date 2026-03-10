export declare function getDefaultTwitterUserAgent(): string;
export declare function resolveTwitterUserAgent(userAgent: any): Promise<any>;
export declare function createRequestTransactionId({ method, url, userAgent, timeoutMs, }: {
    method: any;
    url: any;
    userAgent: any;
    timeoutMs: any;
}): Promise<any>;
export declare function fetchViaRequestBridge(url: any, init: any, timeoutMs: any): Promise<Response>;
