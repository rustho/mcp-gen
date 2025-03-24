export type Action = {
    action: string;
    method: string;
    path: string;
    description?: string;
    params: Record<string, string>;
};
export type StateSchema = {
    description: string;
    type: string;
    properties: Record<string, any>;
    example?: any;
    endpoint?: string;
};
export type MCPJson = {
    name: string;
    description: string;
    version: string;
    metadata: any;
    promptTemplate: {
        language: string;
        style: string;
        format: string;
        prefix: string;
    };
    actions: Action[];
    stateSchema?: StateSchema;
    examples: {
        input: string;
        output: any;
    }[];
};
