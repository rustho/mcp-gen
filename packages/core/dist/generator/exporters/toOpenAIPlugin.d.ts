import { MCPJson } from "../types";
/**
 * Generates OpenAI plugin configuration files based on MCP specification
 *
 * @param mcpJson The MCP JSON structure
 * @param outputDir Output directory
 * @param apiBaseUrl Base URL for the API
 * @param openapiPath Path to the OpenAPI spec file (relative to domain)
 */
export declare function generateOpenAIPlugin(mcpJson: MCPJson, outputDir: string, apiBaseUrl: string, openapiPath?: string): void;
