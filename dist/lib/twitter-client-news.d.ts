export declare function withNews(Base: any): {
    new (...args: any[]): {
        [x: string]: any;
        /**
         * Fetch news and trending topics from Twitter's Explore page tabs
         */
        getNews(count?: number, options?: {}): Promise<{
            success: boolean;
            error: string;
            items?: undefined;
        } | {
            success: boolean;
            items: any[];
            error?: undefined;
        }>;
        /**
         * Fetch a specific timeline tab using GenericTimelineById
         */
        fetchTimelineTab(tabName: any, timelineId: any, maxCount: any, aiOnly: any, includeRaw: any): Promise<any[]>;
        /**
         * Parse items from a GenericTimelineById response
         */
        parseTimelineTabItems(data: any, source: any, maxCount: any, aiOnly: any, includeRaw: any): any[];
        parseNewsItemFromContent(itemContent: any, entryId: any, source: any, seenHeadlines: any, aiOnly: any, includeRaw: any): {
            id: any;
            headline: any;
            category: string;
            timeAgo: any;
            postCount: any;
            description: any;
            url: any;
        };
        enrichWithTweets(items: any, tweetsPerItem: any, includeRaw: any): Promise<void>;
    };
    [x: string]: any;
};
