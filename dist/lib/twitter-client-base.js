import { randomBytes, randomUUID } from 'node:crypto';
import { runtimeQueryIds } from './runtime-query-ids.js';
import { QUERY_IDS, TARGET_QUERY_ID_OPERATIONS } from './twitter-client-constants.js';
import { createRequestTransactionId, fetchViaRequestBridge, getDefaultTwitterUserAgent, resolveTwitterUserAgent, } from './twitter-request-bridge.js';
import { normalizeQuoteDepth } from './twitter-client-utils.js';
const DEFAULT_CHROME_VERSION = '131';
const TWITTER_BEARER_TOKEN = 'AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA';
function chromeVersionFromUserAgent(userAgent) {
    const match = /Chrome\/(\d+)/.exec(userAgent);
    return match?.[1] ?? DEFAULT_CHROME_VERSION;
}
function getSecChUa(version) {
    return `"Chromium";v="${version}", "Not(A:Brand";v="99", "Google Chrome";v="${version}"`;
}
export class TwitterClientBase {
    authToken;
    ct0;
    cookieHeader;
    userAgent;
    timeoutMs;
    quoteDepth;
    clientUuid;
    clientDeviceId;
    clientUserId;
    constructor(options) {
        if (!options.cookies.authToken || !options.cookies.ct0) {
            throw new Error('Both authToken and ct0 cookies are required');
        }
        this.authToken = options.cookies.authToken;
        this.ct0 = options.cookies.ct0;
        this.cookieHeader =
            options.cookies.cookieHeader || `auth_token=${this.authToken}; ct0=${this.ct0}`;
        this.userAgent = options.userAgent || getDefaultTwitterUserAgent();
        this.timeoutMs = options.timeoutMs;
        this.quoteDepth = normalizeQuoteDepth(options.quoteDepth);
        this.clientUuid = randomUUID();
        this.clientDeviceId = randomUUID();
    }
    async getCurrentUser() {
        throw new Error('TwitterClientBase.getCurrentUser() must be implemented by a mixin');
    }
    async sleep(ms) {
        await new Promise((resolve) => setTimeout(resolve, ms));
    }
    async getQueryId(operationName) {
        const cached = await runtimeQueryIds.getQueryId(operationName);
        return cached ?? QUERY_IDS[operationName];
    }
    async refreshQueryIds() {
        if (process.env.NODE_ENV === 'test') {
            return;
        }
        try {
            await runtimeQueryIds.refresh(TARGET_QUERY_ID_OPERATIONS, { force: true });
        }
        catch {
            // Ignore refresh failures; callers fall back to baked-in IDs.
        }
    }
    async withRefreshedQueryIdsOn404(attempt) {
        const firstAttempt = await attempt();
        if (firstAttempt.success || !firstAttempt.had404) {
            return { result: firstAttempt, refreshed: false };
        }
        await this.refreshQueryIds();
        const secondAttempt = await attempt();
        return { result: secondAttempt, refreshed: true };
    }
    async getTweetDetailQueryIds() {
        const primary = await this.getQueryId('TweetDetail');
        return Array.from(new Set([primary, '97JF30KziU00483E_8elBA', 'aFvUsJm2c-oDkJV75blV6g']));
    }
    async getSearchTimelineQueryIds() {
        const primary = await this.getQueryId('SearchTimeline');
        return Array.from(new Set([primary, 'M1jEez78PEfVfbQLvlWMvQ', '5h0kNbk3ii97rmfY6CdgAA', 'Tp1sewRU1AsZpBWhqCZicQ']));
    }
    async fetchWithTimeout(url, init = {}) {
        const method = (init.method ?? 'GET').toUpperCase();
        const headers = new Headers(init.headers ?? {});
        const resolvedUserAgent = await resolveTwitterUserAgent(headers.get('user-agent') || this.userAgent);
        if (this.userAgent !== resolvedUserAgent) {
            this.userAgent = resolvedUserAgent;
        }
        headers.set('user-agent', resolvedUserAgent);
        headers.set('sec-ch-ua', getSecChUa(chromeVersionFromUserAgent(resolvedUserAgent)));
        if (!headers.has('x-client-transaction-id')) {
            const transactionId = await createRequestTransactionId({
                method,
                url,
                userAgent: resolvedUserAgent,
                timeoutMs: this.timeoutMs,
            });
            headers.set('x-client-transaction-id', transactionId || this.createTransactionId());
        }
        const nextInit = { ...init, method, headers };
        const bridgedResponse = await fetchViaRequestBridge(url, nextInit, this.timeoutMs);
        if (bridgedResponse) {
            return bridgedResponse;
        }
        if (!this.timeoutMs || this.timeoutMs <= 0) {
            return fetch(url, nextInit);
        }
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);
        try {
            return await fetch(url, { ...nextInit, signal: controller.signal });
        }
        finally {
            clearTimeout(timeoutId);
        }
    }
    getHeaders() {
        return this.getJsonHeaders();
    }
    createTransactionId() {
        return randomBytes(16).toString('hex');
    }
    getBaseHeaders() {
        const chromeVersion = chromeVersionFromUserAgent(this.userAgent);
        const headers = {
            accept: '*/*',
            'accept-language': 'en-US,en;q=0.9',
            authorization: `Bearer ${TWITTER_BEARER_TOKEN}`,
            'x-csrf-token': this.ct0,
            'x-twitter-auth-type': 'OAuth2Session',
            'x-twitter-active-user': 'yes',
            'x-twitter-client-language': 'en',
            'x-client-uuid': this.clientUuid,
            'x-twitter-client-deviceid': this.clientDeviceId,
            cookie: this.cookieHeader,
            'user-agent': this.userAgent,
            'sec-ch-ua': getSecChUa(chromeVersion),
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            priority: 'u=1, i',
            origin: 'https://x.com',
            referer: 'https://x.com/',
        };
        if (this.clientUserId) {
            headers['x-twitter-client-user-id'] = this.clientUserId;
        }
        return headers;
    }
    getJsonHeaders() {
        return {
            ...this.getBaseHeaders(),
            'content-type': 'application/json',
        };
    }
    getUploadHeaders() {
        // Do not set content-type here; URLSearchParams/FormData need to set it, including boundaries.
        return this.getBaseHeaders();
    }
    async ensureClientUserId() {
        if (process.env.NODE_ENV === 'test' || this.clientUserId) {
            return;
        }
        const result = await this.getCurrentUser();
        if (result.success && result.user.id) {
            this.clientUserId = result.user.id;
        }
    }
}
//# sourceMappingURL=twitter-client-base.js.map