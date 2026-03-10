import type { ParsedTweet } from './twitter-client-utils.js';
declare const TIMELINE_IDS: {
    forYou: string;
    trending: string;
    news: string;
    sports: string;
    entertainment: string;
};
type NewsTab = keyof typeof TIMELINE_IDS;
interface NewsItem {
    id: string;
    headline: string;
    category: string;
    timeAgo?: string;
    postCount?: number;
    description?: string;
    url?: string;
    tweets?: ParsedTweet[];
    _raw?: unknown;
}
interface NewsOptions {
    includeRaw?: boolean;
    withTweets?: boolean;
    tweetsPerItem?: number;
    aiOnly?: boolean;
    tabs?: NewsTab[];
}
export declare function withNews(Base: any): {
    new (...args: any[]): {
        [x: string]: any;
        /**
         * Fetch news and trending topics from Twitter's Explore page tabs
         */
        getNews(count?: number, options?: NewsOptions): Promise<{
            success: boolean;
            error: string;
            items?: undefined;
        } | {
            success: boolean;
            items: NewsItem[];
            error?: undefined;
        }>;
        /**
         * Fetch a specific timeline tab using GenericTimelineById
         */
        fetchTimelineTab(tabName: NewsTab, timelineId: string, maxCount: number, aiOnly: boolean, includeRaw: boolean): Promise<NewsItem[]>;
        /**
         * Parse items from a GenericTimelineById response
         */
        parseTimelineTabItems(data: any, source: any, maxCount: any, aiOnly: any, includeRaw: any): NewsItem[];
        parseNewsItemFromContent(itemContent: any, entryId: any, source: any, seenHeadlines: Set<string>, aiOnly: any, includeRaw: any): NewsItem | null;
        enrichWithTweets(items: NewsItem[], tweetsPerItem: number, includeRaw: boolean): Promise<void>;
    };
    [x: string]: any;
};
export {};
