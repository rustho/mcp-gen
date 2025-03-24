import { MCPJson } from "../types";
export declare function exportJsonTemplates(mcp: MCPJson): {
    action: string;
    params: {
        [k: string]: string;
    };
}[];
