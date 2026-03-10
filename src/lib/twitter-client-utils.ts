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
  richtext?: { text?: string };
  rich_text?: { text?: string };
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

interface TimelineCursorContent {
  cursorType?: string;
  value?: string;
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

type EntityMap = Map<number, DraftEntity>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function normalizeMapOptions(
  quoteDepthOrOptions: number | TweetMappingOptions,
): TweetMappingOptions {
  return typeof quoteDepthOrOptions === 'number'
    ? { quoteDepth: quoteDepthOrOptions }
    : quoteDepthOrOptions;
}

function getEntityMap(contentState: DraftContentState): EntityMap {
  const entityMap = new Map<number, DraftEntity>();
  const rawEntityMap = contentState.entityMap ?? [];

  if (Array.isArray(rawEntityMap)) {
    for (const entry of rawEntityMap) {
      const key = Number.parseInt(entry.key, 10);
      if (!Number.isNaN(key)) {
        entityMap.set(key, entry.value);
      }
    }
    return entityMap;
  }

  for (const [key, value] of Object.entries(rawEntityMap)) {
    const keyNumber = Number.parseInt(key, 10);
    if (!Number.isNaN(keyNumber)) {
      entityMap.set(keyNumber, value);
    }
  }

  return entityMap;
}

function renderBlockText(block: DraftBlock, entityMap: EntityMap): string {
  let text = typeof block.text === 'string' ? block.text : '';

  const linkRanges = (block.entityRanges ?? [])
    .filter((range) => {
      const entity = entityMap.get(range.key);
      return entity?.type === 'LINK' && typeof entity.data?.url === 'string';
    })
    .sort((a, b) => b.offset - a.offset);

  for (const range of linkRanges) {
    const entity = entityMap.get(range.key);
    if (typeof entity?.data?.url !== 'string') {
      continue;
    }

    const linkText = text.slice(range.offset, range.offset + range.length);
    const markdownLink = `[${linkText}](${entity.data.url})`;
    text = text.slice(0, range.offset) + markdownLink + text.slice(range.offset + range.length);
  }

  return text.trim();
}

function renderAtomicBlock(block: DraftBlock, entityMap: EntityMap): string | undefined {
  const entityRanges = block.entityRanges ?? [];
  if (entityRanges.length === 0) {
    return undefined;
  }

  const entity = entityMap.get(entityRanges[0].key);
  if (!entity) {
    return undefined;
  }

  switch (entity.type) {
    case 'MARKDOWN':
      return entity.data?.markdown?.trim();
    case 'DIVIDER':
      return '---';
    case 'TWEET':
      return entity.data?.tweetId
        ? `[Embedded Tweet: https://x.com/i/status/${entity.data.tweetId}]`
        : undefined;
    case 'LINK':
      return entity.data?.url ? `[Link: ${entity.data.url}]` : undefined;
    case 'IMAGE':
      return '[Image]';
    default:
      return undefined;
  }
}

function getNormalizedArticle(result: TweetResult): {
  article?: ArticleNode;
  articleResult?: ArticleNode & { content_state?: DraftContentState };
} {
  const article = result.article;
  return {
    article,
    articleResult: article?.article_results?.result ?? article,
  };
}

function normalizeTweetUserResult(
  result?: TweetUserResult | UserWithVisibilityResults,
): TweetUserResult | undefined {
  if (!result) {
    return undefined;
  }

  if (result.__typename === 'UserWithVisibilityResults' && 'user' in result) {
    return result.user;
  }

  return result as TweetUserResult;
}

function isUserEntity(result?: TweetUserResult): result is TweetUserResult {
  return Boolean(result) && result.__typename === 'User';
}

function getEntryTweetResults(entry: TimelineEntry): TweetResult[] {
  const results: TweetResult[] = [];
  const pushResult = (result?: TweetResult) => {
    if (typeof result?.rest_id === 'string') {
      results.push(result);
    }
  };

  const content = entry.content;
  pushResult(content?.itemContent?.tweet_results?.result);
  pushResult(content?.item?.itemContent?.tweet_results?.result);

  for (const item of content?.items ?? []) {
    pushResult(item.item?.itemContent?.tweet_results?.result);
    pushResult(item.itemContent?.tweet_results?.result);
    pushResult(item.content?.itemContent?.tweet_results?.result);
  }

  return results;
}

export function normalizeQuoteDepth(value: unknown): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return 1;
  }

  return Math.max(0, Math.floor(value));
}

export function firstText(...values: unknown[]): string | undefined {
  for (const value of values) {
    if (typeof value !== 'string') {
      continue;
    }

    const trimmed = value.trim();
    if (trimmed) {
      return trimmed;
    }
  }

  return undefined;
}

export function collectTextFields(value: unknown, keys: Set<string>, output: string[]): void {
  if (!value || typeof value === 'string') {
    return;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      collectTextFields(item, keys, output);
    }
    return;
  }

  if (!isRecord(value)) {
    return;
  }

  for (const [key, nested] of Object.entries(value)) {
    if (keys.has(key) && typeof nested === 'string') {
      const trimmed = nested.trim();
      if (trimmed) {
        output.push(trimmed);
      }
      continue;
    }

    collectTextFields(nested, keys, output);
  }
}

export function uniqueOrdered<T>(values: Iterable<T>): T[] {
  const seen = new Set<T>();
  const result: T[] = [];

  for (const value of values) {
    if (seen.has(value)) {
      continue;
    }
    seen.add(value);
    result.push(value);
  }

  return result;
}

export function renderContentState(contentState?: DraftContentState | null): string | undefined {
  if (!contentState?.blocks || contentState.blocks.length === 0) {
    return undefined;
  }

  const entityMap = getEntityMap(contentState);
  const outputLines: string[] = [];
  let orderedListCounter = 0;
  let previousBlockType: string | undefined;

  for (const block of contentState.blocks) {
    if (block.type !== 'ordered-list-item' && previousBlockType === 'ordered-list-item') {
      orderedListCounter = 0;
    }

    switch (block.type) {
      case 'unstyled': {
        const text = renderBlockText(block, entityMap);
        if (text) {
          outputLines.push(text);
        }
        break;
      }
      case 'header-one': {
        const text = renderBlockText(block, entityMap);
        if (text) {
          outputLines.push(`# ${text}`);
        }
        break;
      }
      case 'header-two': {
        const text = renderBlockText(block, entityMap);
        if (text) {
          outputLines.push(`## ${text}`);
        }
        break;
      }
      case 'header-three': {
        const text = renderBlockText(block, entityMap);
        if (text) {
          outputLines.push(`### ${text}`);
        }
        break;
      }
      case 'unordered-list-item': {
        const text = renderBlockText(block, entityMap);
        if (text) {
          outputLines.push(`- ${text}`);
        }
        break;
      }
      case 'ordered-list-item': {
        orderedListCounter += 1;
        const text = renderBlockText(block, entityMap);
        if (text) {
          outputLines.push(`${orderedListCounter}. ${text}`);
        }
        break;
      }
      case 'blockquote': {
        const text = renderBlockText(block, entityMap);
        if (text) {
          outputLines.push(`> ${text}`);
        }
        break;
      }
      case 'atomic': {
        const entityContent = renderAtomicBlock(block, entityMap);
        if (entityContent) {
          outputLines.push(entityContent);
        }
        break;
      }
      default: {
        const text = renderBlockText(block, entityMap);
        if (text) {
          outputLines.push(text);
        }
      }
    }

    previousBlockType = block.type;
  }

  const result = outputLines.join('\n\n').trim();
  return result || undefined;
}

export function extractArticleText(result: TweetResult): string | undefined {
  const { article, articleResult } = getNormalizedArticle(result);
  if (!article || !articleResult) {
    return undefined;
  }

  if (process.env.BIRD_DEBUG_ARTICLE === '1') {
    console.error(
      '[bird][debug][article] payload:',
      JSON.stringify(
        {
          rest_id: result.rest_id,
          article: articleResult,
          note_tweet: result.note_tweet?.note_tweet_results?.result ?? null,
        },
        null,
        2,
      ),
    );
  }

  const title = firstText(articleResult.title, article.title);
  const richBody = renderContentState(article.article_results?.result?.content_state);

  if (richBody) {
    if (title) {
      const normalizedTitle = title.trim();
      const trimmedBody = richBody.trimStart();
      const headingMatches = [`# ${normalizedTitle}`, `## ${normalizedTitle}`, `### ${normalizedTitle}`];
      const hasTitle =
        trimmedBody === normalizedTitle ||
        trimmedBody.startsWith(`${normalizedTitle}\n`) ||
        headingMatches.some((heading) => trimmedBody.startsWith(heading));

      if (!hasTitle) {
        return `${title}\n\n${richBody}`;
      }
    }

    return richBody;
  }

  let body = firstText(
    articleResult.plain_text,
    article.plain_text,
    articleResult.body?.text,
    articleResult.body?.richtext?.text,
    articleResult.body?.rich_text?.text,
    articleResult.content?.text,
    articleResult.content?.richtext?.text,
    articleResult.content?.rich_text?.text,
    articleResult.text,
    articleResult.richtext?.text,
    articleResult.rich_text?.text,
    article.body?.text,
    article.body?.richtext?.text,
    article.body?.rich_text?.text,
    article.content?.text,
    article.content?.richtext?.text,
    article.content?.rich_text?.text,
    article.text,
    article.richtext?.text,
    article.rich_text?.text,
  );

  if (body && title && body.trim() === title.trim()) {
    body = undefined;
  }

  if (!body) {
    const collected: string[] = [];
    collectTextFields(articleResult, new Set(['text', 'title']), collected);
    collectTextFields(article, new Set(['text', 'title']), collected);
    const filtered = title
      ? uniqueOrdered(collected).filter((value) => value !== title)
      : uniqueOrdered(collected);
    if (filtered.length > 0) {
      body = filtered.join('\n\n');
    }
  }

  if (title && body && !body.startsWith(title)) {
    return `${title}\n\n${body}`;
  }

  return body ?? title;
}

export function extractNoteTweetText(result: TweetResult): string | undefined {
  const note = result.note_tweet?.note_tweet_results?.result;
  if (!note) {
    return undefined;
  }

  return firstText(
    note.text,
    note.richtext?.text,
    note.rich_text?.text,
    note.content?.text,
    note.content?.richtext?.text,
    note.content?.rich_text?.text,
  );
}

export function extractTweetText(result: TweetResult): string | undefined {
  return extractArticleText(result) ?? extractNoteTweetText(result) ?? firstText(result.legacy?.full_text);
}

export function extractArticleMetadata(result: TweetResult): TweetArticleMetadata | undefined {
  const { article, articleResult } = getNormalizedArticle(result);
  if (!article || !articleResult) {
    return undefined;
  }

  const title = firstText(articleResult.title, article.title);
  if (!title) {
    return undefined;
  }

  return {
    title,
    previewText: firstText(articleResult.preview_text, article.preview_text),
  };
}

export function extractMedia(result: TweetResult): TweetMedia[] | undefined {
  const rawMedia = result.legacy?.extended_entities?.media ?? result.legacy?.entities?.media;
  if (!rawMedia || rawMedia.length === 0) {
    return undefined;
  }

  const media: TweetMedia[] = [];
  for (const item of rawMedia) {
    if (!item.type || !item.media_url_https) {
      continue;
    }

    const mediaItem: TweetMedia = {
      type: item.type,
      url: item.media_url_https,
    };

    const sizes = item.sizes;
    if (typeof sizes?.large?.w === 'number' && typeof sizes.large.h === 'number') {
      mediaItem.width = sizes.large.w;
      mediaItem.height = sizes.large.h;
    } else if (typeof sizes?.medium?.w === 'number' && typeof sizes.medium.h === 'number') {
      mediaItem.width = sizes.medium.w;
      mediaItem.height = sizes.medium.h;
    }

    if (sizes?.small) {
      mediaItem.previewUrl = `${item.media_url_https}:small`;
    }

    if ((item.type === 'video' || item.type === 'animated_gif') && item.video_info?.variants) {
      const mp4Variants = item.video_info.variants.filter(
        (variant): variant is TweetMediaVariant & { url: string } =>
          variant.content_type === 'video/mp4' && typeof variant.url === 'string',
      );
      const mp4WithBitrate = mp4Variants
        .filter((variant): variant is TweetMediaVariant & { url: string; bitrate: number } =>
          typeof variant.bitrate === 'number',
        )
        .sort((a, b) => b.bitrate - a.bitrate);
      const selectedVariant = mp4WithBitrate[0] ?? mp4Variants[0];

      if (selectedVariant) {
        mediaItem.videoUrl = selectedVariant.url;
      }
      if (typeof item.video_info.duration_millis === 'number') {
        mediaItem.durationMs = item.video_info.duration_millis;
      }
    }

    media.push(mediaItem);
  }

  return media.length > 0 ? media : undefined;
}

export function unwrapTweetResult(result?: TweetResult | null): TweetResult | undefined {
  if (!result) {
    return undefined;
  }

  return result.tweet ?? result;
}

export function mapTweetResult(
  result: TweetResult,
  quoteDepthOrOptions: number | TweetMappingOptions,
): ParsedTweet | undefined {
  const options = normalizeMapOptions(quoteDepthOrOptions);
  const { quoteDepth, includeRaw = false } = options;
  const userResult = normalizeTweetUserResult(result.core?.user_results?.result);
  const userLegacy = userResult?.legacy;
  const userCore = userResult?.core;
  const username = userLegacy?.screen_name ?? userCore?.screen_name;
  const name = userLegacy?.name ?? userCore?.name ?? username;
  const userId = userResult?.rest_id;

  if (!result.rest_id || !username) {
    return undefined;
  }

  const text = extractTweetText(result);
  if (!text) {
    return undefined;
  }

  let quotedTweet: ParsedTweet | undefined;
  if (quoteDepth > 0) {
    const quotedResult = unwrapTweetResult(result.quoted_status_result?.result);
    if (quotedResult) {
      quotedTweet = mapTweetResult(quotedResult, { quoteDepth: quoteDepth - 1, includeRaw });
    }
  }

  const tweetData: ParsedTweet = {
    id: result.rest_id,
    text,
    createdAt: result.legacy?.created_at,
    replyCount: result.legacy?.reply_count,
    retweetCount: result.legacy?.retweet_count,
    likeCount: result.legacy?.favorite_count,
    conversationId: result.legacy?.conversation_id_str,
    inReplyToStatusId: result.legacy?.in_reply_to_status_id_str ?? undefined,
    author: {
      username,
      name: name || username,
    },
    authorId: userId,
    quotedTweet,
    media: extractMedia(result),
    article: extractArticleMetadata(result),
  };

  if (includeRaw) {
    tweetData._raw = result;
  }

  return tweetData;
}

export function findTweetInInstructions(
  instructions: TimelineInstruction[] | undefined,
  tweetId: string,
): TweetResult | undefined {
  for (const instruction of instructions ?? []) {
    for (const entry of instruction.entries ?? []) {
      const result = entry.content?.itemContent?.tweet_results?.result;
      if (result?.rest_id === tweetId) {
        return result;
      }
    }
  }

  return undefined;
}

export function collectTweetResultsFromEntry(entry: TimelineEntry): TweetResult[] {
  return getEntryTweetResults(entry);
}

export function parseTweetsFromInstructions(
  instructions: TimelineInstruction[] | undefined,
  quoteDepthOrOptions: number | TweetMappingOptions,
): ParsedTweet[] {
  const options = normalizeMapOptions(quoteDepthOrOptions);
  const tweets: ParsedTweet[] = [];
  const seen = new Set<string>();

  for (const instruction of instructions ?? []) {
    for (const entry of instruction.entries ?? []) {
      for (const result of collectTweetResultsFromEntry(entry)) {
        const mapped = mapTweetResult(result, options);
        if (!mapped || seen.has(mapped.id)) {
          continue;
        }
        seen.add(mapped.id);
        tweets.push(mapped);
      }
    }
  }

  return tweets;
}

export function extractCursorFromInstructions(
  instructions: TimelineInstruction[] | undefined,
  cursorType = 'Bottom',
): string | undefined {
  for (const instruction of instructions ?? []) {
    for (const entry of instruction.entries ?? []) {
      const content = entry.content;
      if (
        content?.cursorType === cursorType &&
        typeof content.value === 'string' &&
        content.value.length > 0
      ) {
        return content.value;
      }
    }
  }

  return undefined;
}

export function parseUsersFromInstructions(
  instructions: TimelineInstruction[] | undefined,
): ParsedTwitterUser[] {
  const users: ParsedTwitterUser[] = [];

  for (const instruction of instructions ?? []) {
    for (const entry of instruction.entries ?? []) {
      const userResult = normalizeTweetUserResult(entry.content?.itemContent?.user_results?.result);
      if (!isUserEntity(userResult)) {
        continue;
      }

      const legacy = userResult.legacy;
      const core = userResult.core;
      const username = legacy?.screen_name ?? core?.screen_name;

      if (!userResult.rest_id || !username) {
        continue;
      }

      users.push({
        id: userResult.rest_id,
        username,
        name: legacy?.name ?? core?.name ?? username,
        description: legacy?.description,
        followersCount: legacy?.followers_count,
        followingCount: legacy?.friends_count,
        isBlueVerified: userResult.is_blue_verified,
        profileImageUrl: legacy?.profile_image_url_https ?? userResult.avatar?.image_url,
        createdAt: legacy?.created_at ?? core?.created_at,
      });
    }
  }

  return users;
}
