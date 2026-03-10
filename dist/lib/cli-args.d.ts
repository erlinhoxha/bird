export interface CliInvocationResolution {
    argv: string[] | null;
    showHelp: boolean;
}
export declare function looksLikeTweetInput(value: string): boolean;
export declare function resolveCliInvocation(rawArgs: string[], knownCommands: Set<string>): CliInvocationResolution;
