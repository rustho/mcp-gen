import { MCPJson } from "../types";
export declare function exportFunctionSchemas(mcp: MCPJson): {
    name: string;
    description: string;
    parameters: {
        type: string;
        properties: {
            [k: string]: {
                type: string;
            };
        };
        required: string[];
    };
}[];
