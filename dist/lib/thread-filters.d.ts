import type { ParsedTweet } from './twitter-client-utils.js';
export interface ThreadFilterOptions {
    includeAncestorBranches?: boolean;
}
export declare function filterAuthorChain(tweets: ParsedTweet[], bookmarkedTweet: ParsedTweet): ParsedTweet[];
export declare function filterAuthorOnly(tweets: ParsedTweet[], bookmarkedTweet: ParsedTweet): ParsedTweet[];
export declare function filterFullChain(tweets: ParsedTweet[], bookmarkedTweet: ParsedTweet, options?: ThreadFilterOptions): ParsedTweet[];
export type ThreadPosition = 'standalone' | 'root' | 'middle' | 'end';
export interface ThreadMetadata {
    isThread: boolean;
    threadPosition: ThreadPosition;
    hasSelfReplies: boolean;
    threadRootId: string | null;
}
export declare function addThreadMetadata(tweet: ParsedTweet, allConversationTweets: ParsedTweet[]): ParsedTweet & ThreadMetadata;
