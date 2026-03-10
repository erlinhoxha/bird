export declare function withTweetDetails(Base: any): {
    new (...args: any[]): {
        [x: string]: any;
        fetchUserArticlePlainText(userId: any, tweetId: any): Promise<{
            title?: undefined;
            plainText?: undefined;
        } | {
            title: string;
            plainText: string;
        }>;
        fetchTweetDetail(tweetId: any, cursor: any): Promise<{
            success: boolean;
            error: any;
            data?: undefined;
        } | {
            success: boolean;
            data: any;
            error?: undefined;
        }>;
        /**
         * Get tweet details by ID
         */
        getTweet(tweetId: any, options?: {}): Promise<{
            success: boolean;
            error: any;
            data?: undefined;
        } | {
            success: boolean;
            data: any;
            error?: undefined;
        } | {
            success: boolean;
            tweet: {
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
        }>;
        /**
         * Get replies to a tweet by ID
         */
        getReplies(tweetId: any, options?: {}): Promise<{
            success: boolean;
            error: any;
            data?: undefined;
        } | {
            success: boolean;
            data: any;
            error?: undefined;
        } | {
            success: boolean;
            tweets: any[];
        }>;
        /**
         * Get full conversation thread for a tweet ID
         */
        getThread(tweetId: any, options?: {}): Promise<{
            success: boolean;
            error: any;
            data?: undefined;
        } | {
            success: boolean;
            data: any;
            error?: undefined;
        } | {
            success: boolean;
            tweets: any[];
        }>;
        /**
         * Get replies to a tweet with pagination support
         */
        getRepliesPaged(tweetId: any, options?: {}): Promise<{
            success: boolean;
            tweets: any;
            nextCursor: any;
            error?: undefined;
        } | {
            success: boolean;
            tweets: any;
            nextCursor: any;
            error: any;
        } | {
            success: boolean;
            error: any;
            tweets?: undefined;
            nextCursor?: undefined;
        }>;
        /**
         * Get full conversation thread with pagination support
         */
        getThreadPaged(tweetId: any, options?: {}): Promise<{
            success: boolean;
            tweets: any;
            nextCursor: any;
            error?: undefined;
        } | {
            success: boolean;
            tweets: any;
            nextCursor: any;
            error: any;
        } | {
            success: boolean;
            error: any;
            tweets?: undefined;
            nextCursor?: undefined;
        }>;
    };
    [x: string]: any;
};
