export interface StateSchema {
    path: string;
    description: string;
    schema: any;
    example: any;
}
export declare function extractStateSchema(api: any, stateEndpoint?: string): StateSchema | null;
