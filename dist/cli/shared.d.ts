import { resolveCredentials } from '../lib/cookies.js';
import { extractTweetId } from '../lib/extract-tweet-id.js';
import type { ParsedTweet, TweetMedia } from '../lib/twitter-client-utils.js';
type CookieSource = 'safari' | 'chrome' | 'firefox';
type StatusKind = 'ok' | 'warn' | 'err' | 'info' | 'hint';
type LabelKind = 'url' | 'date' | 'source' | 'engine' | 'credentials' | 'user' | 'userId' | 'email';
interface OutputConfig {
    plain: boolean;
    emoji: boolean;
    color: boolean;
    hyperlinks: boolean;
}
interface CliColors {
    banner(text: string): string;
    subtitle(text: string): string;
    section(text: string): string;
    bullet(text: string): string;
    command(text: string): string;
    option(text: string): string;
    argument(text: string): string;
    description(text: string): string;
    muted(text: string): string;
    accent(text: string): string;
}
interface CliConfig {
    chromeProfile?: string;
    chromeProfileDir?: string;
    firefoxProfile?: string;
    cookieSource?: string | string[];
    cookieTimeoutMs?: number | string;
    timeoutMs?: number | string;
    quoteDepth?: number | string;
}
interface MediaOptions {
    media: string[];
    alts: Array<string | undefined>;
}
interface MediaSpec {
    path: string;
    mime: string;
    buffer: Buffer;
    alt?: string;
}
interface PrintableTweet extends ParsedTweet {
    media?: TweetMedia[];
    quotedTweet?: PrintableTweet;
}
interface PrintTweetsOptions {
    json?: boolean;
    emptyMessage?: string;
    showSeparator?: boolean;
}
interface PrintTweetsResultOptions {
    json?: boolean;
    usePagination?: boolean;
    emptyMessage?: string;
}
interface TweetsResult {
    tweets?: PrintableTweet[];
    nextCursor?: string | null;
}
export interface CliContext {
    isTty: boolean;
    getOutput(): OutputConfig;
    colors: CliColors;
    p(kind: StatusKind): string;
    l(kind: LabelKind): string;
    config: CliConfig;
    applyOutputFromCommand(command: {
        optsWithGlobals(): Record<string, unknown>;
    }): void;
    resolveTimeoutFromOptions(options: Record<string, unknown>): number | undefined;
    resolveQuoteDepthFromOptions(options: Record<string, unknown>): number | undefined;
    resolveCredentialsFromOptions(opts: Record<string, unknown>): ReturnType<typeof resolveCredentials>;
    loadMedia(opts: MediaOptions): MediaSpec[];
    printTweets(tweets: PrintableTweet[], opts?: PrintTweetsOptions): void;
    printTweetsResult(result: TweetsResult, opts: PrintTweetsResultOptions): void;
    extractTweetId: typeof extractTweetId;
}
export declare const collectCookieSource: (value: string, previous?: CookieSource[]) => CookieSource[];
export declare function createCliContext(normalizedArgs: string[], env?: NodeJS.ProcessEnv): CliContext;
export {};
