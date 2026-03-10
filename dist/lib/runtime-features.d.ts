export declare function loadFeatureOverrides(): any;
export declare function getFeatureOverridesSnapshot(): {
    cachePath: any;
    overrides: {};
};
export declare function applyFeatureOverrides(setName: any, base: any): any;
export declare function refreshFeatureOverridesCache(): Promise<{
    cachePath: any;
    overrides: {};
}>;
export declare function clearFeatureOverridesCache(): void;
