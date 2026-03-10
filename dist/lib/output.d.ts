declare const STATUS: {
    ok: {
        emoji: string;
        text: string;
        plain: string;
    };
    warn: {
        emoji: string;
        text: string;
        plain: string;
    };
    err: {
        emoji: string;
        text: string;
        plain: string;
    };
    info: {
        emoji: string;
        text: string;
        plain: string;
    };
    hint: {
        emoji: string;
        text: string;
        plain: string;
    };
};
declare const LABELS: {
    url: {
        emoji: string;
        text: string;
        plain: string;
    };
    date: {
        emoji: string;
        text: string;
        plain: string;
    };
    source: {
        emoji: string;
        text: string;
        plain: string;
    };
    engine: {
        emoji: string;
        text: string;
        plain: string;
    };
    credentials: {
        emoji: string;
        text: string;
        plain: string;
    };
    user: {
        emoji: string;
        text: string;
        plain: string;
    };
    userId: {
        emoji: string;
        text: string;
        plain: string;
    };
    email: {
        emoji: string;
        text: string;
        plain: string;
    };
};
export type OutputStatusKind = keyof typeof STATUS;
export type OutputLabelKind = keyof typeof LABELS;
export interface OutputConfig {
    plain: boolean;
    emoji: boolean;
    color: boolean;
    hyperlinks: boolean;
}
export interface OutputCommanderOptions {
    plain?: boolean;
    emoji?: boolean;
    color?: boolean;
}
export interface TweetStats {
    likeCount?: number;
    retweetCount?: number;
    replyCount?: number;
}
export declare function resolveOutputConfigFromArgv(argv: string[], env: NodeJS.ProcessEnv, isTty: boolean): OutputConfig;
export declare function resolveOutputConfigFromCommander(opts: OutputCommanderOptions, env: NodeJS.ProcessEnv, isTty: boolean): OutputConfig;
export declare function statusPrefix(kind: OutputStatusKind, cfg: OutputConfig): string;
export declare function labelPrefix(kind: OutputLabelKind, cfg: OutputConfig): string;
export declare function formatStatsLine(stats: TweetStats, cfg: OutputConfig): string;
export declare function formatTweetUrl(tweetId: string): string;
/**
 * Wraps a URL in OSC 8 escape sequences to make it clickable in supported terminals.
 * Falls back to plain text when not in a TTY or when hyperlinks are disabled.
 */
export declare function hyperlink(url: string, text: string | undefined, cfg: OutputConfig | undefined): string;
export declare function formatTweetUrlLine(tweetId: string, cfg: OutputConfig): string;
export {};
