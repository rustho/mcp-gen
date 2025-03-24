import { MCPJson } from "../types";
/**
 * Generates a TypeScript file with LangChain tools based on MCP specification
 *
 * @param mcpJson The MCP JSON structure
 * @param outputDir Output directory
 * @param apiBaseUrl Base URL for the API
 */
export declare function generateLangChainTools(mcpJson: MCPJson, outputDir: string, apiBaseUrl: string): void;
