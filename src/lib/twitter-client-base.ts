import { randomBytes, randomUUID } from 'node:crypto';
import { runtimeQueryIds } from './runtime-query-ids.js';
import { QUERY_IDS, TARGET_QUERY_ID_OPERATIONS } from './twitter-client-constants.js';
import {
  createRequestTransactionId,
  fetchViaRequestBridge,
  getDefaultTwitterUserAgent,
  resolveTwitterUserAgent,
} from './twitter-request-bridge.js';
import { normalizeQuoteDepth } from './twitter-client-utils.js';

const DEFAULT_CHROME_VERSION = '131';
const TWITTER_BEARER_TOKEN =
  'AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA';

type QueryIdOperation = keyof typeof QUERY_IDS;

export interface TwitterClientCookies {
  authToken: string;
  ct0: string;
  cookieHeader?: string | null;
}

export interface TwitterClientBaseOptions {
  cookies: TwitterClientCookies;
  userAgent?: string;
  timeoutMs?: number;
  quoteDepth?: number;
}

export interface CurrentUser {
  id: string;
  username: string;
  name: string;
}

export interface CurrentUserSuccessResult {
  success: true;
  user: CurrentUser;
}

export interface CurrentUserFailureResult {
  success: false;
  error: string;
}

export type CurrentUserResult = CurrentUserSuccessResult | CurrentUserFailureResult;

export interface QueryRefreshAttemptResult {
  success?: boolean;
  had404?: boolean;
}

export interface QueryRefreshAttemptOutcome<TAttemptResult> {
  result: TAttemptResult;
  refreshed: boolean;
}

export interface TwitterBaseHeaders {
  accept: string;
  'accept-language': string;
  authorization: string;
  'x-csrf-token': string;
  'x-twitter-auth-type': string;
  'x-twitter-active-user': string;
  'x-twitter-client-language': string;
  'x-client-uuid': string;
  'x-twitter-client-deviceid': string;
  cookie: string;
  'user-agent': string;
  'sec-ch-ua': string;
  'sec-ch-ua-mobile': string;
  'sec-ch-ua-platform': string;
  'sec-fetch-dest': string;
  'sec-fetch-mode': string;
  'sec-fetch-site': string;
  priority: string;
  origin: string;
  referer: string;
  'x-twitter-client-user-id'?: string;
}

export interface TwitterJsonHeaders extends TwitterBaseHeaders {
  'content-type': 'application/json';
}

function chromeVersionFromUserAgent(userAgent: string): string {
  const match = /Chrome\/(\d+)/.exec(userAgent);
  return match?.[1] ?? DEFAULT_CHROME_VERSION;
}

function getSecChUa(version: string): string {
  return `"Chromium";v="${version}", "Not(A:Brand";v="99", "Google Chrome";v="${version}"`;
}

export class TwitterClientBase {
  authToken: string;
  ct0: string;
  cookieHeader: string;
  userAgent: string;
  timeoutMs?: number;
  quoteDepth: number;
  clientUuid: string;
  clientDeviceId: string;
  clientUserId?: string;

  constructor(options: TwitterClientBaseOptions) {
    if (!options.cookies.authToken || !options.cookies.ct0) {
      throw new Error('Both authToken and ct0 cookies are required');
    }

    this.authToken = options.cookies.authToken;
    this.ct0 = options.cookies.ct0;
    this.cookieHeader =
      options.cookies.cookieHeader || `auth_token=${this.authToken}; ct0=${this.ct0}`;
    this.userAgent = options.userAgent || getDefaultTwitterUserAgent();
    this.timeoutMs = options.timeoutMs;
    this.quoteDepth = normalizeQuoteDepth(options.quoteDepth) as number;
    this.clientUuid = randomUUID();
    this.clientDeviceId = randomUUID();
  }

  protected async getCurrentUser(): Promise<CurrentUserResult> {
    throw new Error('TwitterClientBase.getCurrentUser() must be implemented by a mixin');
  }

  async sleep(ms: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getQueryId(operationName: QueryIdOperation): Promise<string> {
    const cached = await runtimeQueryIds.getQueryId(operationName);
    return cached ?? QUERY_IDS[operationName];
  }

  async refreshQueryIds(): Promise<void> {
    if (process.env.NODE_ENV === 'test') {
      return;
    }

    try {
      await runtimeQueryIds.refresh(TARGET_QUERY_ID_OPERATIONS, { force: true });
    } catch {
      // Ignore refresh failures; callers fall back to baked-in IDs.
    }
  }

  async withRefreshedQueryIdsOn404<TAttemptResult extends QueryRefreshAttemptResult>(
    attempt: () => Promise<TAttemptResult>,
  ): Promise<QueryRefreshAttemptOutcome<TAttemptResult>> {
    const firstAttempt = await attempt();
    if (firstAttempt.success || !firstAttempt.had404) {
      return { result: firstAttempt, refreshed: false };
    }

    await this.refreshQueryIds();
    const secondAttempt = await attempt();
    return { result: secondAttempt, refreshed: true };
  }

  async getTweetDetailQueryIds(): Promise<string[]> {
    const primary = await this.getQueryId('TweetDetail');
    return Array.from(new Set([primary, '97JF30KziU00483E_8elBA', 'aFvUsJm2c-oDkJV75blV6g']));
  }

  async getSearchTimelineQueryIds(): Promise<string[]> {
    const primary = await this.getQueryId('SearchTimeline');
    return Array.from(
      new Set([primary, 'M1jEez78PEfVfbQLvlWMvQ', '5h0kNbk3ii97rmfY6CdgAA', 'Tp1sewRU1AsZpBWhqCZicQ']),
    );
  }

  async fetchWithTimeout(url: string, init: RequestInit = {}): Promise<Response> {
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

    const nextInit: RequestInit = { ...init, method, headers };
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
    } finally {
      clearTimeout(timeoutId);
    }
  }

  getHeaders(): TwitterJsonHeaders {
    return this.getJsonHeaders();
  }

  createTransactionId(): string {
    return randomBytes(16).toString('hex');
  }

  getBaseHeaders(): TwitterBaseHeaders {
    const chromeVersion = chromeVersionFromUserAgent(this.userAgent);
    const headers: TwitterBaseHeaders = {
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

  getJsonHeaders(): TwitterJsonHeaders {
    return {
      ...this.getBaseHeaders(),
      'content-type': 'application/json',
    };
  }

  getUploadHeaders(): TwitterBaseHeaders {
    // Do not set content-type here; URLSearchParams/FormData need to set it, including boundaries.
    return this.getBaseHeaders();
  }

  async ensureClientUserId(): Promise<void> {
    if (process.env.NODE_ENV === 'test' || this.clientUserId) {
      return;
    }

    const result = await this.getCurrentUser();
    if (result.success && result.user.id) {
      this.clientUserId = result.user.id;
    }
  }
}
