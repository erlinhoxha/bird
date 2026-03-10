export declare function normalizeQuoteDepth(value: any): number;
export declare function firstText(...values: any[]): string;
export declare function collectTextFields(value: any, keys: any, output: any): void;
export declare function uniqueOrdered(values: any): any[];
/**
 * Renders a Draft.js content_state into readable markdown/text format.
 * Handles blocks (paragraphs, headers, lists) and entities (code blocks, links, tweets, dividers).
 */
export declare function renderContentState(contentState: any): string;
export declare function extractArticleText(result: any): string;
export declare function extractNoteTweetText(result: any): string;
export declare function extractTweetText(result: any): string;
export declare function extractArticleMetadata(result: any): {
    title: string;
    previewText: string;
};
export declare function extractMedia(result: any): any[];
export declare function unwrapTweetResult(result: any): any;
export declare function mapTweetResult(result: any, quoteDepthOrOptions: any): {
    id: any;
    text: string;
    createdAt: any;
    replyCount: any;
    retweetCount: any;
    likeCount: any;
    conversationId: any;
    inReplyToStatusId: any;
    author: {
        username: any;
        name: any;
    };
    authorId: any;
    quotedTweet: any;
    media: any[];
    article: {
        title: string;
        previewText: string;
    };
};
export declare function findTweetInInstructions(instructions: any, tweetId: any): any;
export declare function collectTweetResultsFromEntry(entry: any): any[];
export declare function parseTweetsFromInstructions(instructions: any, quoteDepthOrOptions: any): any[];
export declare function extractCursorFromInstructions(instructions: any, cursorType?: string): any;
export declare function parseUsersFromInstructions(instructions: any): any[];
