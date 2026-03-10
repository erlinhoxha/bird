export declare function resolveOutputConfigFromArgv(argv: any, env: any, isTty: any): {
    plain: any;
    emoji: boolean;
    color: boolean;
    hyperlinks: any;
};
export declare function resolveOutputConfigFromCommander(opts: any, env: any, isTty: any): {
    plain: boolean;
    emoji: any;
    color: boolean;
    hyperlinks: any;
};
export declare function statusPrefix(kind: any, cfg: any): string;
export declare function labelPrefix(kind: any, cfg: any): string;
export declare function formatStatsLine(stats: any, cfg: any): string;
export declare function formatTweetUrl(tweetId: any): string;
/**
 * Wraps a URL in OSC 8 escape sequences to make it clickable in supported terminals.
 * Falls back to plain text when not in a TTY or when hyperlinks are disabled.
 */
export declare function hyperlink(url: any, text: any, cfg: any): any;
export declare function formatTweetUrlLine(tweetId: any, cfg: any): string;
