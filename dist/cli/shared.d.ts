import { extractTweetId } from '../lib/extract-tweet-id.js';
export declare const collectCookieSource: (value: any, previous?: any[]) => any[];
export declare function createCliContext(normalizedArgs: any, env?: NodeJS.ProcessEnv): {
    isTty: boolean;
    getOutput: () => {
        plain: any;
        emoji: boolean;
        color: boolean;
        hyperlinks: any;
    };
    colors: {
        banner: (text: any) => any;
        subtitle: (text: any) => any;
        section: (text: any) => any;
        bullet: (text: any) => any;
        command: (text: any) => any;
        option: (text: any) => any;
        argument: (text: any) => any;
        description: (text: any) => any;
        muted: (text: any) => any;
        accent: (text: any) => any;
    };
    p: (kind: any) => string;
    l: (kind: any) => string;
    config: any;
    applyOutputFromCommand: (command: any) => void;
    resolveTimeoutFromOptions: (options: any) => number;
    resolveQuoteDepthFromOptions: (options: any) => number;
    resolveCredentialsFromOptions: (opts: any) => Promise<{
        cookies: {
            authToken: any;
            ct0: any;
            cookieHeader: any;
            source: any;
        };
        warnings: any[];
    }>;
    loadMedia: (opts: any) => any[];
    printTweets: (tweets: any, opts?: {}) => void;
    printTweetsResult: (result: any, opts: any) => void;
    extractTweetId: typeof extractTweetId;
};
