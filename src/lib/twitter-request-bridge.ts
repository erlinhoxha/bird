import {
  createCuimpHttp,
  type BinaryInfo,
  type CuimpDescriptor,
  type CuimpInstance,
  type CuimpOptions,
  type CuimpRequestConfig,
  type Method,
} from 'cuimp';
import { ClientTransaction, handleXMigration } from 'x-client-transaction-id';

const CLIENT_TRANSACTION_CACHE_TTL_MS = 30 * 60 * 1000;
const DEFAULT_CHROME_VERSION = '136';
const DEFAULT_TWITTER_USER_AGENT_PREFIX =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/';

interface CachedClientTransaction {
  createdAt: number;
  transaction: ClientTransaction;
}

interface CuimpRuntimeCore {
  ensurePath?: () => Promise<string>;
  getBinaryInfo?: () => BinaryInfo | undefined;
}

type CuimpBridgeClient = CuimpInstance & {
  core?: CuimpRuntimeCore;
};

type SerializedBody = CuimpRequestConfig['data'] | undefined;

let clientTransactionCache: CachedClientTransaction | null = null;
let resolvedChromeVersion: string | null = null;
const cuimpClients = new Map<string, CuimpBridgeClient>();
const quietCuimpLogger: NonNullable<CuimpOptions['logger']> = {
  info: (...args) => console.info(...args),
  warn: (...args) => console.warn(...args),
  error: (...args) => console.error(...args),
  debug: () => {},
};

function hostForUrl(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return '';
  }
}

function isBridgeableTwitterHost(url: string): boolean {
  const host = hostForUrl(url);
  return (
    host === 'x.com' ||
    host === 'api.x.com' ||
    host === 'twitter.com' ||
    host === 'api.twitter.com' ||
    host === 'upload.twitter.com'
  );
}

function normalizeChromeVersion(version: unknown): string | null {
  if (typeof version !== 'string') {
    return null;
  }

  const trimmed = version.trim();
  return /^\d{3}$/.test(trimmed) ? trimmed : null;
}

function buildTwitterUserAgent(version: string): string {
  return `${DEFAULT_TWITTER_USER_AGENT_PREFIX}${version}.0.0.0 Safari/537.36`;
}

function isBirdDefaultChromeUserAgent(userAgent: string): boolean {
  return (
    userAgent.startsWith(DEFAULT_TWITTER_USER_AGENT_PREFIX) &&
    userAgent.endsWith('.0.0.0 Safari/537.36')
  );
}

function chromeVersionFromUserAgent(userAgent: string): string {
  const match = /Chrome\/(\d+)/.exec(userAgent);
  return match?.[1] ?? DEFAULT_CHROME_VERSION;
}

function requestedChromeVersionForUserAgent(userAgent?: string | null): string | null {
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

function buildCuimpDescriptor(version: string | null): CuimpDescriptor {
  return {
    browser: 'chrome',
    ...(version ? { version } : {}),
  };
}

function getCuimpClient(userAgent?: string | null): CuimpBridgeClient {
  const version = requestedChromeVersionForUserAgent(userAgent);
  const cacheKey = version ? `chrome:${version}` : 'chrome:default';
  const existing = cuimpClients.get(cacheKey);
  if (existing) {
    return existing;
  }

  const client = createCuimpHttp({
    descriptor: buildCuimpDescriptor(version),
    logger: quietCuimpLogger,
    proxy: process.env.TWITTER_PROXY || undefined,
  }) as unknown as CuimpBridgeClient;

  cuimpClients.set(cacheKey, client);
  return client;
}

async function resolveActiveChromeVersion(userAgent?: string | null): Promise<string> {
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
  } catch {
    // Fall through to the requested/cached/default version below.
  }

  return (
    requestedChromeVersionForUserAgent(userAgent) ??
    resolvedChromeVersion ??
    DEFAULT_CHROME_VERSION
  );
}
export function getDefaultTwitterUserAgent() {
  return buildTwitterUserAgent(resolvedChromeVersion ?? DEFAULT_CHROME_VERSION);
}

export async function resolveTwitterUserAgent(userAgent?: string | null): Promise<string> {
  if (!userAgent || !isBirdDefaultChromeUserAgent(userAgent)) {
    return userAgent || getDefaultTwitterUserAgent();
  }

  const version = await resolveActiveChromeVersion(userAgent);
  return buildTwitterUserAgent(version);
}

async function getClientTransaction(userAgent?: string | null): Promise<ClientTransaction> {
  void userAgent;

  const now = Date.now();
  if (
    clientTransactionCache &&
    now - clientTransactionCache.createdAt < CLIENT_TRANSACTION_CACHE_TTL_MS
  ) {
    return clientTransactionCache.transaction;
  }

  const document = await handleXMigration();
  const transaction = await ClientTransaction.create(document);
  clientTransactionCache = {
    createdAt: now,
    transaction,
  };
  return transaction;
}

async function serializeBody(
  body: RequestInit['body'],
  headers: Record<string, string>,
): Promise<{ data: SerializedBody; headers: Record<string, string> }> {
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

function normalizeMethod(method?: string): Method {
  const upperMethod = method?.toUpperCase();
  switch (upperMethod) {
    case 'DELETE':
    case 'GET':
    case 'HEAD':
    case 'OPTIONS':
    case 'PATCH':
    case 'POST':
    case 'PUT':
      return upperMethod;
    default:
      return 'GET';
  }
}

export async function createRequestTransactionId({
  method,
  url,
  userAgent,
  timeoutMs,
}: {
  method: string;
  url: string;
  userAgent?: string | null;
  timeoutMs?: number;
}): Promise<string | null> {
  void timeoutMs;

  if (!isBridgeableTwitterHost(url)) {
    return null;
  }

  try {
    await resolveActiveChromeVersion(userAgent);
    const transaction = await getClientTransaction(userAgent);
    const path = new URL(url).pathname;
    return await transaction.generateTransactionId(method, path);
  } catch {
    clientTransactionCache = null;
    return null;
  }
}

export async function fetchViaRequestBridge(
  url: string,
  init: RequestInit = {},
  timeoutMs?: number,
): Promise<Response | null> {
  if (!isBridgeableTwitterHost(url)) {
    return null;
  }

  try {
    const method = normalizeMethod(init.method);
    const headerEntries = Object.fromEntries(new Headers(init.headers ?? {}).entries());
    const { data, headers } = await serializeBody(init.body, headerEntries);
    const client = getCuimpClient(headers['user-agent']);
    const response = await client.request({
      url,
      method,
      headers,
      data,
      timeout: timeoutMs,
    });

    return new Response(new Uint8Array(response.rawBody), {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  } catch {
    return null;
  }
}
