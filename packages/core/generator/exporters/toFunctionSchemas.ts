import { MCPJson } from "../types";

export function exportFunctionSchemas(mcp: MCPJson) {
  const schemas = mcp.actions.map(action => ({
    name: action.action,
    description: action.description || `${action.method} ${action.path}`,
    parameters: {
      type: "object",
      properties: Object.fromEntries(
        Object.entries(action.params).map(([key, type]) => [
          key, { type }
        ])
      ),
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