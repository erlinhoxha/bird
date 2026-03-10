interface DraftEntityRange {
    key: number;
    offset: number;
    length: number;
}
interface DraftEntityData {
    url?: string;
    markdown?: string;
    tweetId?: string;
}
interface DraftEntity {
    type?: string;
    data?: DraftEntityData;
}
interface DraftEntityArrayEntry {
    key: string;
    value: DraftEntity;
}
interface DraftBlock {
    type?: string;
    text?: string;
    entityRanges?: DraftEntityRange[];
}
interface DraftContentState {
    blocks?: DraftBlock[];
    entityMap?: DraftEntityArrayEntry[] | Record<string, DraftEntity>;
}
interface TextNode {
    text?: string;
    richtext?: {
        text?: string;
    };
    rich_text?: {
        text?: string;
    };
}
interface ArticleNode extends TextNode {
    title?: string;
    plain_text?: string;
    preview_text?: string;
    body?: TextNode;
    content?: TextNode;
    article_results?: {
        result?: ArticleNode & {
            content_state?: DraftContentState;
        };
    };
}
interface NoteTweetNode extends TextNode {
    content?: TextNode;
}
interface TweetMediaSize {
    w?: number;
    h?: number;
}
interface TweetMediaVariant {
    content_type?: string;
    url?: string;
    bitrate?: number;
}
interface TweetMediaInfo {
    variants?: TweetMediaVariant[];
    duration_millis?: number;
}
interface TweetMediaEntity {
    type?: string;
    media_url_https?: string;
    sizes?: {
        large?: TweetMediaSize;
        medium?: TweetMediaSize;
        small?: TweetMediaSize;
    };
    video_info?: TweetMediaInfo;
}
interface TweetLegacy {
    full_text?: string;
    created_at?: string;
    reply_count?: number;
    retweet_count?: number;
    favorite_count?: number;
    conversation_id_str?: string;
    in_reply_to_status_id_str?: string;
    extended_entities?: {
        media?: TweetMediaEntity[];
    };
    entities?: {
        media?: TweetMediaEntity[];
    };
}
interface TweetUserCore {
    screen_name?: string;
    name?: string;
    created_at?: string;
}
interface TweetUserLegacy {
    screen_name?: string;
    name?: string;
    description?: string;
    followers_count?: number;
    friends_count?: number;
    profile_image_url_https?: string;
    created_at?: string;
}
interface TweetUserResult {
    __typename?: string;
    rest_id?: string;
    legacy?: TweetUserLegacy;
    core?: TweetUserCore;
    is_blue_verified?: boolean;
    avatar?: {
        image_url?: string;
    };
}
interface UserWithVisibilityResults {
    __typename?: string;
    user?: TweetUserResult;
}
interface UserResultsWrapper {
    result?: TweetUserResult | UserWithVisibilityResults;
}
export interface TweetArticleMetadata {
    title: string;
    previewText?: string;
}
export interface TweetMedia {
    type: string;
    url: string;
    width?: number;
    height?: number;
    previewUrl?: string;
    videoUrl?: string;
    durationMs?: number;
}
export interface ParsedTwitterUser {
    id: string;
    username: string;
    name: string;
    description?: string;
    followersCount?: number;
    followingCount?: number;
    isBlueVerified?: boolean;
    profileImageUrl?: string;
    createdAt?: string;
}
export interface ParsedTweetAuthor {
    username: string;
    name: string;
}
export interface ParsedTweet {
    id: string;
    text: string;
    createdAt?: string;
    replyCount?: number;
    retweetCount?: number;
    likeCount?: number;
    conversationId?: string;
    inReplyToStatusId?: string;
    author: ParsedTweetAuthor;
    authorId?: string;
    quotedTweet?: ParsedTweet;
    media?: TweetMedia[];
    article?: TweetArticleMetadata;
    _raw?: unknown;
}
export interface TweetMappingOptions {
    quoteDepth: number;
    includeRaw?: boolean;
}
interface TweetResult {
    tweet?: TweetResult;
    rest_id?: string;
    legacy?: TweetLegacy;
    article?: ArticleNode;
    note_tweet?: {
        note_tweet_results?: {
            result?: NoteTweetNode;
        };
    };
    core?: {
        user_results?: UserResultsWrapper;
    };
    quoted_status_result?: {
        result?: TweetResult;
    };
}
interface TimelineItemContent {
    tweet_results?: {
        result?: TweetResult;
    };
    user_results?: {
        result?: TweetUserResult | UserWithVisibilityResults;
    };
}
interface TimelineEntryItem {
    itemContent?: TimelineItemContent;
}
interface TimelineEntryContent {
    cursorType?: string;
    value?: string;
    itemContent?: TimelineItemContent;
    item?: TimelineEntryItem;
    items?: Array<{
        item?: TimelineEntryItem;
        itemContent?: TimelineItemContent;
        content?: {
            itemContent?: TimelineItemContent;
        };
    }>;
}
interface TimelineEntry {
    content?: TimelineEntryContent;
}
export interface TimelineInstruction {
    entries?: TimelineEntry[];
}
export declare function normalizeQuoteDepth(value: unknown): number;
export declare function firstText(...values: unknown[]): string | undefined;
export declare function collectTextFields(value: unknown, keys: Set<string>, output: string[]): void;
export declare function uniqueOrdered<T>(values: Iterable<T>): T[];
export declare function renderContentState(contentState?: DraftContentState | null): string | undefined;
export declare function extractArticleText(result: TweetResult): string | undefined;
export declare function extractNoteTweetText(result: TweetResult): string | undefined;
export declare function extractTweetText(result: TweetResult): string | undefined;
export declare function extractArticleMetadata(result: TweetResult): TweetArticleMetadata | undefined;
export declare function extractMedia(result: TweetResult): TweetMedia[] | undefined;
export declare function unwrapTweetResult(result?: TweetResult | null): TweetResult | undefined;
export declare function mapTweetResult(result: TweetResult, quoteDepthOrOptions: number | TweetMappingOptions): ParsedTweet | undefined;
export declare function findTweetInInstructions(instructions: TimelineInstruction[] | undefined, tweetId: string): TweetResult | undefined;
export declare function collectTweetResultsFromEntry(entry: TimelineEntry): TweetResult[];
export declare function parseTweetsFromInstructions(instructions: TimelineInstruction[] | undefined, quoteDepthOrOptions: number | TweetMappingOptions): ParsedTweet[];
export declare function extractCursorFromInstructions(instructions: TimelineInstruction[] | undefined, cursorType?: string): string | undefined;
export declare function parseUsersFromInstructions(instructions: TimelineInstruction[] | undefined): ParsedTwitterUser[];
export {};
