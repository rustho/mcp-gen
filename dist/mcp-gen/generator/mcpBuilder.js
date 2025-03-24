"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildMCPJson = buildMCPJson;
const extractState_1 = require("./extractState");
function buildMCPJson(api, actions, metadata = {}, stateEndpoint) {
    const state = (0, extractState_1.extractStateSchema)(api, stateEndpoint);
    return {
        name: "Generated MCP",
        description: "Auto-generated Model Control Protocol from OpenAPI",
        version: "1.0.0",
        metadata: Object.assign({ generatedAt: new Date().toISOString(), source: "OpenAPI 3.0" }, metadata),
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
//# sourceMappingURL=mcpBuilder.js.map