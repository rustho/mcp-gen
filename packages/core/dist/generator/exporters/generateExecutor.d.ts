import { MCPJson } from "../types";
/**
 * Type definition for the ApiExecutor class
 * (exported for type checking in other files)
 */
export interface ApiExecutor {
    baseUrl: string;
    execute(actionName: string, params?: any): Promise<any>;
    getState(): Promise<any>;
}
/**
 * Generates an executor TypeScript file that can be used independently
 * from the MCP server for executing API calls
 */
export declare function generateExecutor(mcpJson: MCPJson, outputPath: string, apiBaseUrl: string): void;
