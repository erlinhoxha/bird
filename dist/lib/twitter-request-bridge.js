// @ts-nocheck
import { createCuimpHttp } from 'cuimp';
import { ClientTransaction, handleXMigration } from 'x-client-transaction-id';
const CLIENT_TRANSACTION_CACHE_TTL_MS = 30 * 60 * 1000;
const DEFAULT_CHROME_VERSION = '136';
const DEFAULT_TWITTER_USER_AGENT_PREFIX = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/';
let clientTransactionCache = null;
let resolvedChromeVersion = null;
const cuimpClients = new Map();
const quietCuimpLogger = {
    info: (...args) => console.info(...args),
    warn: (...args) => console.warn(...args),
    error: (...args) => console.error(...args),
    debug: () => { },
};
function hostForUrl(url) {
    try {
        return new URL(url).hostname;
    }
    catch {
        return '';
    }
}
function isBridgeableTwitterHost(url) {
    const host = hostForUrl(url);
    return host === 'x.com' || host === 'api.x.com' || host === 'twitter.com' || host === 'api.twitter.com' || host === 'upload.twitter.com';
}
function normalizeChromeVersion(version) {
    if (typeof version !== 'string') {
        return null;
    }
    const trimmed = version.trim();
    return /^\d{3}$/.test(trimmed) ? trimmed : null;
}
function buildTwitterUserAgent(version) {
    return `${DEFAULT_TWITTER_USER_AGENT_PREFIX}${version}.0.0.0 Safari/537.36`;
}
function isBirdDefaultChromeUserAgent(userAgent) {
    return typeof userAgent === 'string' &&
        userAgent.startsWith(DEFAULT_TWITTER_USER_AGENT_PREFIX) &&
        userAgent.endsWith('.0.0.0 Safari/537.36');
}
function chromeVersionFromUserAgent(userAgent) {
    const match = /Chrome\/(\d+)/.exec(userAgent || '');
    return match?.[1] ?? DEFAULT_CHROME_VERSION;
}
function requestedChromeVersionForUserAgent(userAgent) {
    if (!userAgent) {
        return null;
    }
    const parsedVersion = normalizeChromeVersion(chromeVersionFromUserAgent(userAgent));
    if (!parsedVersion) {
        return null;
    }
    if (!isBirdDefaultChromeUserAgent(userAgent)) {
        return parsedVersion;
    }
    return parsedVersion === resolvedChromeVersion ? parsedVersion : null;
}
function getCuimpClient(userAgent) {
    const version = requestedChromeVersionForUserAgent(userAgent);
    const cacheKey = version ? `chrome:${version}` : 'chrome:default';
    const existing = cuimpClients.get(cacheKey);
    if (existing) {
        return existing;
    }
    const client = createCuimpHttp({
        descriptor: {
            browser: 'chrome',
            ...(version ? { version } : {}),
        },
        logger: quietCuimpLogger,
        proxy: process.env.TWITTER_PROXY || undefined,
    });
    cuimpClients.set(cacheKey, client);
    return client;
}
async function resolveActiveChromeVersion(userAgent) {
    const client = getCuimpClient(userAgent);
    try {
        await client.core?.ensurePath?.();
        const binaryInfo = client.core?.getBinaryInfo?.();
        const actualVersion = normalizeChromeVersion(binaryInfo?.version);
        if (actualVersion) {
            resolvedChromeVersion = actualVersion;
            cuimpClients.set(`chrome:${actualVersion}`, client);
            return actualVersion;
        }
    }
    catch {
        // fall through to request/cached/default version below
    }
    return requestedChromeVersionForUserAgent(userAgent) ?? resolvedChromeVersion ?? DEFAULT_CHROME_VERSION;
}
export function getDefaultTwitterUserAgent() {
    return buildTwitterUserAgent(resolvedChromeVersion ?? DEFAULT_CHROME_VERSION);
}
export async function resolveTwitterUserAgent(userAgent) {
    if (!isBirdDefaultChromeUserAgent(userAgent ?? '')) {
        return userAgent || getDefaultTwitterUserAgent();
    }
    const version = await resolveActiveChromeVersion(userAgent);
    return buildTwitterUserAgent(version);
}
async function getClientTransaction(userAgent) {
    const now = Date.now();
    if (clientTransactionCache && now - clientTransactionCache.createdAt < CLIENT_TRANSACTION_CACHE_TTL_MS) {
        return clientTransactionCache.transaction;
    }
    const document = await handleXMigration();
    const transaction = await ClientTransaction.create(document);
    clientTransactionCache = {
        createdAt: now,
        transaction,
        userAgent,
    };
    return transaction;
}
async function serializeBody(body, headers) {
    if (body == null) {
        return { data: undefined, headers };
    }
    if (typeof body === 'string' || body instanceof URLSearchParams || Buffer.isBuffer(body)) {
        return { data: body, headers };
    }
    if (body instanceof ArrayBuffer) {
        return { data: Buffer.from(body), headers };
    }
    if (ArrayBuffer.isView(body)) {
        return {
            data: Buffer.from(body.buffer, body.byteOffset, body.byteLength),
            headers,
        };
    }
    if (typeof Blob !== 'undefined' && body instanceof Blob) {
        return {
            data: Buffer.from(await body.arrayBuffer()),
            headers,
        };
    }
    if (typeof FormData !== 'undefined' && body instanceof FormData) {
        const request = new Request('https://x.invalid/', {
            method: 'POST',
            headers,
            body,
        });
        return {
            data: Buffer.from(await request.arrayBuffer()),
            headers: Object.fromEntries(request.headers.entries()),
        };
    }
    return { data: undefined, headers };
}
export async function createRequestTransactionId({ method, url, userAgent, timeoutMs, }) {
    void timeoutMs;
    if (!isBridgeableTwitterHost(url)) {
        return null;
    }
    try {
        await resolveActiveChromeVersion(userAgent);
        const transaction = await getClientTransaction(userAgent);
        const path = new URL(url).pathname;
        return await transaction.generateTransactionId(method, path);
    }
    catch {
        clientTransactionCache = null;
        return null;
    }
}
export async function fetchViaRequestBridge(url, init, timeoutMs) {
    if (!isBridgeableTwitterHost(url)) {
        return null;
    }
    try {
        const headerEntries = Object.fromEntries(new Headers(init.headers ?? {}).entries());
        const { data, headers } = await serializeBody(init.body, headerEntries);
        const client = getCuimpClient(headers['user-agent'] || '');
        const response = await client.request({
            url,
            method: (init.method ?? 'GET').toUpperCase(),
            headers,
            data,
            timeout: timeoutMs,
        });
        return new Response(response.rawBody, {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
        });
    }
    catch {
        return null;
    }
}
//# sourceMappingURL=twitter-request-bridge.js.map