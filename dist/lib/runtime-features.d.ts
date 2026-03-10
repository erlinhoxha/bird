export type FeatureMap = Record<string, boolean>;
export interface FeatureOverrides {
    global: FeatureMap;
    sets: Record<string, FeatureMap>;
}
export interface FeatureOverrideSnapshot {
    cachePath: string;
    overrides: Partial<FeatureOverrides>;
}
export declare function loadFeatureOverrides(): FeatureOverrides;
export declare function getFeatureOverridesSnapshot(): FeatureOverrideSnapshot;
export declare function applyFeatureOverrides<T extends FeatureMap>(setName: string, base: T): T;
export declare function refreshFeatureOverridesCache(): Promise<FeatureOverrideSnapshot>;
export declare function clearFeatureOverridesCache(): void;
