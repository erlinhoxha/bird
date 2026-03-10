export declare function getDefaultTwitterUserAgent(): string;
export declare function resolveTwitterUserAgent(userAgent?: string | null): Promise<string>;
export declare function createRequestTransactionId({ method, url, userAgent, timeoutMs, }: {
    method: string;
    url: string;
    userAgent?: string | null;
    timeoutMs?: number;
}): Promise<string | null>;
export declare function fetchViaRequestBridge(url: string, init?: RequestInit, timeoutMs?: number): Promise<Response | null>;
