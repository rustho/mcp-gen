import { MCPJson } from "../types";

export function exportJsonTemplates(mcp: MCPJson) {
  const templates = mcp.actions.map(action => ({
    action: action.action,
    params: Object.fromEntries(
      Object.entries(action.params).map(([key, type]) => [key, type])
    )
  }));
  
  // Add getState template if state schema is available
  if (mcp.stateSchema) {
    templates.push({
      action: "getState",
      params: {}
    });
  }
  
  return templates;
} 