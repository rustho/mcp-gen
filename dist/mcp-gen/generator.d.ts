type Action = {
    action: string;
    method: string;
    path: string;
    params: Record<string, string>;
};
export declare function extractActions(api: any): Action[];
export declare function generatePrompt(actions: Action[]): string;
export {};
