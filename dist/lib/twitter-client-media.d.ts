export declare function withMedia(Base: any): {
    new (...args: any[]): {
        [x: string]: any;
        mediaCategoryForMime(mimeType: any): "tweet_gif" | "tweet_image" | "tweet_video";
        uploadMedia(input: any): Promise<{
            success: boolean;
            error: any;
            mediaId?: undefined;
        } | {
            success: boolean;
            mediaId: any;
            error?: undefined;
        }>;
    };
    [x: string]: any;
};
