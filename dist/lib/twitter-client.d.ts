declare const MixedTwitterClient: {
    new (...args: any[]): {
        [x: string]: any;
        getNews(count?: number, options?: {}): Promise<{
            success: boolean;
            error: string;
            items?: undefined;
        } | {
            success: boolean;
            items: any[];
            error?: undefined;
        }>;
        fetchTimelineTab(tabName: any, timelineId: any, maxCount: any, aiOnly: any, includeRaw: any): Promise<any[]>;
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
export declare class TwitterClient extends MixedTwitterClient {
}
export {};
