import { Action, MCPJson } from "./types";
import { extractStateSchema } from "./extractState";

export function buildMCPJson(api: any, actions: Action[], metadata = {}, stateEndpoint?: string): MCPJson {
  const state = extractStateSchema(api, stateEndpoint);

  return {
    name: "Generated MCP",
    description: "Auto-generated Model Control Protocol from OpenAPI",
    version: "1.0.0",
    metadata: {
      generatedAt: new Date().toISOString(),
      source: "OpenAPI 3.0",
      ...metadata
    },
    promptTemplate: {
      language: "en",
      style: "instructive",
      format: "plain",
      prefix: "You are an agent controlling an API. Here are the available actions:\n"
    },
    actions,
    stateSchema: state
      ? {
          description: state.description,
          type: state.schema.type || "object",
          properties: state.schema.properties || {},
          example: state.example
        }
      : undefined,
    examples: []
  };
} 