"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportFunctionSchemas = exportFunctionSchemas;
function exportFunctionSchemas(mcp) {
    const schemas = mcp.actions.map(action => ({
        name: action.action,
        description: action.description || `${action.method} ${action.path}`,
        parameters: {
            type: "object",
            properties: Object.fromEntries(Object.entries(action.params).map(([key, type]) => [
                key, { type }
            ])),
            required: Object.keys(action.params)
        }
    }));
    // Add getState function if state schema is available
    if (mcp.stateSchema) {
        schemas.push({
            name: "getState",
            description: `Get the current system state. ${mcp.stateSchema.description || ''}`,
            parameters: {
                type: "object",
                properties: {},
                required: []
            }
        });
    }
    return schemas;
}
//# sourceMappingURL=toFunctionSchemas.js.map