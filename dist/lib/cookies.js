/**
 * Browser cookie extraction for Twitter authentication.
 * Uses Bird's vendored browser cookie readers for Safari/Chrome/Firefox.
 */
import { getCookies } from './vendor/sweet-cookie/public.js';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { fetchViaRequestBridge, getDefaultTwitterUserAgent, resolveTwitterUserAgent, } from './twitter-request-bridge.js';
const TWITTER_URL = 'https://x.com/';
const TWITTER_ORIGINS = ['https://x.com/', 'https://twitter.com/'];
const DEFAULT_COOKIE_TIMEOUT_MS = 30_000;
const COOKIE_CACHE_FILE = join(homedir(), '.cache', 'bird', 'cookies.json');
const COOKIE_CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const BEARER_TOKEN = 'AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA';
const VERIFY_URLS = [
    'https://api.x.com/1.1/account/verify_credentials.json',
    'https://x.com/i/api/1.1/account/settings.json',
];
function normalizeValue(value) {
    if (typeof value !== 'string') {
        return null;
    }
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
}
function minimalCookieHeader(authToken, ct0) {
    return `auth_token=${authToken}; ct0=${ct0}`;
}
function cookieDomainRank(cookie) {
    const domain = typeof cookie.domain === 'string' ? cookie.domain : '';
    if (domain.endsWith('x.com')) {
        return 2;
    }
    if (domain.endsWith('twitter.com')) {
        return 1;
    }
    return 0;
}
function buildCookieHeaderFromCookies(cookies, authToken, ct0) {
    const bestByName = new Map();
    for (const cookie of cookies) {
        if (!cookie.name || typeof cookie.value !== 'string') {
            continue;
        }
        const existing = bestByName.get(cookie.name);
        if (!existing || cookieDomainRank(cookie) > cookieDomainRank(existing)) {
            bestByName.set(cookie.name, cookie);
        }
    }
    bestByName.set('auth_token', { name: 'auth_token', value: authToken, domain: 'x.com' });
    bestByName.set('ct0', { name: 'ct0', value: ct0, domain: 'x.com' });
    const orderedNames = [...bestByName.keys()].sort((a, b) => {
        if (a === 'auth_token')
            return -1;
        if (b === 'auth_token')
            return 1;
        if (a === 'ct0')
            return -1;
        if (b === 'ct0')
            return 1;
        return a.localeCompare(b);
    });
    return orderedNames
        .map((name) => {
        const cookie = bestByName.get(name);
        if (!cookie?.name || typeof cookie.value !== 'string') {
            return null;
        }
        return `${cookie.name}=${cookie.value}`;
    })
        .filter((value) => typeof value === 'string' && value.length > 0)
        .join('; ');
}
function buildEmpty() {
    return { authToken: null, ct0: null, cookieHeader: null, source: null };
}
function buildCookies(authToken, ct0, source, fullCookieHeader = null) {
    return {
        authToken,
        ct0,
        cookieHeader: fullCookieHeader ?? minimalCookieHeader(authToken, ct0),
        source,
    };
}
function readEnvCookie(cookies, keys, field) {
    if (cookies[field]) {
        return;
    }
    for (const key of keys) {
        const value = normalizeValue(process.env[key]);
        if (!value) {
            continue;
        }
        cookies[field] = value;
        if (!cookies.source) {
            cookies.source = `env ${key}`;
        }
        break;
    }
}
function isCachedCookiesRecord(value) {
    if (!value || typeof value !== 'object') {
        return false;
    }
    const record = value;
    return (typeof record.savedAt === 'number' &&
        typeof record.authToken === 'string' &&
        typeof record.ct0 === 'string');
}
function loadCookieCache() {
    try {
        if (!existsSync(COOKIE_CACHE_FILE)) {
            return null;
        }
        const raw = JSON.parse(readFileSync(COOKIE_CACHE_FILE, 'utf8'));
        if (!isCachedCookiesRecord(raw)) {
            return null;
        }
        if (Date.now() - raw.savedAt > COOKIE_CACHE_TTL_MS) {
            return null;
        }
        return buildCookies(raw.authToken, raw.ct0, raw.source ?? 'cache', typeof raw.cookieHeader === 'string' ? raw.cookieHeader : null);
    }
    catch {
        return null;
    }
}
function saveCookieCache(cookies) {
    if (!cookies.authToken || !cookies.ct0) {
        return;
    }
    try {
        mkdirSync(dirname(COOKIE_CACHE_FILE), { recursive: true });
        writeFileSync(COOKIE_CACHE_FILE, JSON.stringify({
            authToken: cookies.authToken,
            ct0: cookies.ct0,
            cookieHeader: cookies.cookieHeader,
            source: cookies.source,
            savedAt: Date.now(),
        }), 'utf8');
    }
    catch {
        // cache write failures are non-fatal
    }
}
async function verifyCookies(cookies, userAgent) {
    if (!cookies.authToken || !cookies.ct0) {
        return true;
    }
    const resolvedUserAgent = await resolveTwitterUserAgent(userAgent);
    const headers = {
        authorization: `Bearer ${BEARER_TOKEN}`,
        cookie: cookies.cookieHeader ?? minimalCookieHeader(cookies.authToken, cookies.ct0),
        'x-csrf-token': cookies.ct0,
        'x-twitter-active-user': 'yes',
        'x-twitter-auth-type': 'OAuth2Session',
        'user-agent': resolvedUserAgent,
    };
    for (const url of VERIFY_URLS) {
        try {
            const response = (await fetchViaRequestBridge(url, {
                method: 'GET',
                headers,
            }, 5_000)) ?? (await fetch(url, { headers }));
            if (response.status === 401 || response.status === 403) {
                throw new Error(`Cookie expired or invalid (HTTP ${response.status})`);
            }
            if (response.ok) {
                return true;
            }
        }
        catch (error) {
            if (error instanceof Error && error.message.startsWith('Cookie expired or invalid')) {
                throw error;
            }
        }
    }
    return true;
}
function defaultUserAgent() {
    return getDefaultTwitterUserAgent();
}
function resolveSources(cookieSource) {
    if (Array.isArray(cookieSource)) {
        return cookieSource;
    }
    if (cookieSource) {
        return [cookieSource];
    }
    return ['safari', 'chrome', 'firefox'];
}
function labelForSource(source, profile) {
    if (source === 'safari') {
        return 'Safari';
    }
    if (source === 'chrome') {
        return profile ? `Chrome profile "${profile}"` : 'Chrome default profile';
    }
    return profile ? `Firefox profile "${profile}"` : 'Firefox default profile';
}
function pickCookieValue(cookies, name) {
    const matches = cookies.filter((cookie) => cookie?.name === name && typeof cookie.value === 'string');
    if (matches.length === 0) {
        return null;
    }
    const preferred = matches.find((cookie) => (cookie.domain ?? '').endsWith('x.com'));
    if (preferred?.value) {
        return preferred.value;
    }
    const twitter = matches.find((cookie) => (cookie.domain ?? '').endsWith('twitter.com'));
    if (twitter?.value) {
        return twitter.value;
    }
    return matches[0]?.value ?? null;
}
async function readTwitterCookiesFromBrowser(options) {
    const warnings = [];
    const out = buildEmpty();
    const { cookies, warnings: providerWarnings } = (await getCookies({
        url: TWITTER_URL,
        origins: [...TWITTER_ORIGINS],
        browsers: [options.source],
        mode: 'merge',
        chromeProfile: options.chromeProfile,
        firefoxProfile: options.firefoxProfile,
        timeoutMs: options.cookieTimeoutMs,
    }));
    warnings.push(...providerWarnings);
    const authToken = pickCookieValue(cookies, 'auth_token');
    const ct0 = pickCookieValue(cookies, 'ct0');
    if (authToken) {
        out.authToken = authToken;
    }
    if (ct0) {
        out.ct0 = ct0;
    }
    if (out.authToken && out.ct0) {
        out.cookieHeader =
            buildCookieHeaderFromCookies(cookies, out.authToken, out.ct0) ??
                minimalCookieHeader(out.authToken, out.ct0);
        out.source = labelForSource(options.source, options.source === 'chrome' ? options.chromeProfile : options.firefoxProfile);
        return { cookies: out, warnings };
    }
    if (options.source === 'safari') {
        warnings.push('No Twitter cookies found in Safari. Make sure you are logged into x.com in Safari.');
    }
    else if (options.source === 'chrome') {
        warnings.push('No Twitter cookies found in Chrome. Make sure you are logged into x.com in Chrome.');
    }
    else {
        warnings.push('No Twitter cookies found in Firefox. Make sure you are logged into x.com in Firefox and the profile exists.');
    }
    return { cookies: out, warnings };
}
export async function extractCookiesFromSafari() {
    return readTwitterCookiesFromBrowser({ source: 'safari' });
}
export async function extractCookiesFromChrome(profile) {
    return readTwitterCookiesFromBrowser({ source: 'chrome', chromeProfile: profile });
}
export async function extractCookiesFromFirefox(profile) {
    return readTwitterCookiesFromBrowser({ source: 'firefox', firefoxProfile: profile });
}
/**
 * Resolve Twitter credentials from multiple sources.
 * Priority: CLI args > environment variables > browsers (ordered).
 */
export async function resolveCredentials(options) {
    const warnings = [];
    const cookies = buildEmpty();
    const cookieTimeoutMs = typeof options.cookieTimeoutMs === 'number' &&
        Number.isFinite(options.cookieTimeoutMs) &&
        options.cookieTimeoutMs > 0
        ? options.cookieTimeoutMs
        : process.platform === 'darwin'
            ? DEFAULT_COOKIE_TIMEOUT_MS
            : undefined;
    if (options.authToken) {
        cookies.authToken = options.authToken;
        cookies.source = 'CLI argument';
    }
    if (options.ct0) {
        cookies.ct0 = options.ct0;
        if (!cookies.source) {
            cookies.source = 'CLI argument';
        }
    }
    readEnvCookie(cookies, ['AUTH_TOKEN', 'TWITTER_AUTH_TOKEN'], 'authToken');
    readEnvCookie(cookies, ['CT0', 'TWITTER_CT0'], 'ct0');
    if (cookies.authToken && cookies.ct0) {
        cookies.cookieHeader = minimalCookieHeader(cookies.authToken, cookies.ct0);
        await verifyCookies(cookies, defaultUserAgent());
        return { cookies, warnings };
    }
    const cachedCookies = loadCookieCache();
    if (cachedCookies?.authToken && cachedCookies?.ct0) {
        try {
            await verifyCookies(cachedCookies, defaultUserAgent());
            return { cookies: cachedCookies, warnings };
        }
        catch {
            // stale cache falls through to fresh browser extraction
        }
    }
    const sourcesToTry = resolveSources(options.cookieSource);
    for (const source of sourcesToTry) {
        const result = await readTwitterCookiesFromBrowser({
            source,
            chromeProfile: options.chromeProfile,
            firefoxProfile: options.firefoxProfile,
            cookieTimeoutMs,
        });
        warnings.push(...result.warnings);
        if (result.cookies.authToken && result.cookies.ct0) {
            await verifyCookies(result.cookies, defaultUserAgent());
            saveCookieCache(result.cookies);
            return { cookies: result.cookies, warnings };
        }
    }
    if (!cookies.authToken) {
        warnings.push('Missing auth_token - provide via --auth-token, AUTH_TOKEN env var, or login to x.com in Safari/Chrome/Firefox');
    }
    if (!cookies.ct0) {
        warnings.push('Missing ct0 - provide via --ct0, CT0 env var, or login to x.com in Safari/Chrome/Firefox');
    }
    if (cookies.authToken && cookies.ct0) {
        cookies.cookieHeader = minimalCookieHeader(cookies.authToken, cookies.ct0);
    }
    return { cookies, warnings };
}
//# sourceMappingURL=cookies.js.map