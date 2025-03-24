import fs from "fs";
import path from "path";
import { MCPJson, Action } from "../types";

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
export function generateExecutor(
  mcpJson: MCPJson,
  outputPath: string,
  apiBaseUrl: string
): void {
  const executorCode = `
/**
 * API Executor for ${mcpJson.name}
 * Generated from ${mcpJson.description || "OpenAPI spec"}
 * Version: ${mcpJson.version || "1.0.0"}
 */

// API Executor - can be used with any framework or directly
export class ApiExecutor {
  private baseUrl: string;

  constructor(baseUrl: string = '${apiBaseUrl}') {
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  }

  /**
   * Execute an API action with the given name and parameters
   */
  async execute(actionName: string, params: any = {}) {
    const handler = this.getHandler(actionName);
    if (!handler) {
      throw new Error(\`Unknown action: \${actionName}\`);
    }
    
    return handler(params);
  }

  /**
   * Get the current state of the API/system
   */
  async getState() {
    ${
      mcpJson.stateSchema
        ? `
    // Using ${mcpJson.stateSchema.description} for state
    try {
      const response = await fetch(\`\${this.baseUrl}${
        mcpJson.stateSchema.endpoint || ""
      }\`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching state:', error);
      return { error: 'Failed to fetch state' };
    }`
        : `
    // No state schema defined
    return { message: 'No state schema defined' };`
    }
  }

  /**
   * Get handler for a specific action
   */
  private getHandler(actionName: string) {
    try {
      // Try to dynamically load the handler from handlers directory
      // This allows for user customization of handlers
      const handlerModule = require(\`./handlers/\${actionName}\`);
      if (handlerModule && typeof handlerModule.handler === 'function') {
        // Bind this instance to the handler
        return handlerModule.handler.bind(this);
      }
    } catch (error) {
      // If handler file doesn't exist, use built-in handlers
    }

    // Built-in handlers
    switch (actionName) {
${generateActionHandlers(mcpJson)}
      default:
        return null;
    }
  }
}

/**
 * Helper function to build URL with query parameters
 */
function buildUrl(baseUrl: string, path: string, queryParams: Record<string, any> = {}): string {
  const fullUrl = \`\${baseUrl}\${path}\`;
  const url = new URL(fullUrl);
  
  Object.entries(queryParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, String(value));
    }
  });
  
  return url.toString();
}

// Example usage:
// 
// import { ApiExecutor } from './executor';
//
// async function main() {
//   const api = new ApiExecutor('${apiBaseUrl}');
//   
//   // Get API state
//   const state = await api.getState();
//   console.log('Current state:', state);
//   
//   // Execute an action
//   ${
    mcpJson.actions && mcpJson.actions.length > 0
      ? `const result = await api.execute('${
          mcpJson.actions[0].action
        }', ${JSON.stringify(
          generateSampleParams(mcpJson.actions[0]),
          null,
          2
        )});`
      : `// const result = await api.execute('actionName', { param1: 'value1' });`
  }
// }
//
// main().catch(console.error);
`;

  fs.writeFileSync(
    path.resolve(outputPath, "executor.ts"),
    executorCode.trim()
  );
  console.log(
    `✅ Generated API executor at ${path.join(outputPath, "executor.ts")}`
  );
}

/**
 * Generate case statements for each action in the switch statement
 */
function generateActionHandlers(mcpJson: MCPJson): string {
  if (!mcpJson.actions || mcpJson.actions.length === 0) {
    return "      // No actions defined";
  }

  return mcpJson.actions
    .map((action: Action) => {
      const { path, method } = action;

      // Extract path parameters
      const pathParams = (path.match(/{([^}]+)}/g) || []).map((param) =>
        param.substring(1, param.length - 1)
      );

      // Get query parameters (params that aren't in the path)
      const queryParams = action.params
        ? Object.keys(action.params).filter(
            (param) => !pathParams.includes(param)
          )
        : [];

      // Format the path with template strings for path parameters
      const formattedPath = path.replace(/{([^}]+)}/g, "${params.$1}");

      // Generate handler based on the HTTP method
      switch (method) {
        case "GET":
          return `      case '${action.action}':
        return async (params: any) => {
          ${
            queryParams.length > 0
              ? `const queryObj = {};
          ${queryParams
            .map(
              (param) =>
                `if (params.${param} !== undefined) queryObj['${param}'] = params.${param};`
            )
            .join("\n          ")}
          const url = buildUrl(this.baseUrl, \`${formattedPath}\`, queryObj);`
              : `const url = \`\${this.baseUrl}${formattedPath}\`;`
          }
          
          const response = await fetch(url);
          return await response.json();
        };`;

        case "POST":
        case "PUT":
        case "PATCH":
          return `      case '${action.action}':
        return async (params: any) => {
          const url = \`\${this.baseUrl}${formattedPath}\`;
          const bodyParams = {...params};
          ${pathParams
            .map((param) => `delete bodyParams.${param};`)
            .join("\n          ")}
          
          const response = await fetch(url, {
            method: '${method}',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(bodyParams)
          });
          
          return await response.json();
        };`;

        case "DELETE":
          return `      case '${action.action}':
        return async (params: any) => {
          const url = \`\${this.baseUrl}${formattedPath}\`;
          
          const response = await fetch(url, {
            method: 'DELETE'
          });
          
          return await response.json();
        };`;

        default:
          return `      case '${action.action}':
        return async (params: any) => {
          const url = \`\${this.baseUrl}${formattedPath}\`;
          
          const response = await fetch(url, {
            method: '${method}'
          });
          
          return await response.json();
        };`;
      }
    })
    .join("\n\n");
}

/**
 * Generate sample parameters for example usage
 */
function generateSampleParams(action: Action): Record<string, string> {
  if (!action.params) return {};

  const result: Record<string, string> = {};

  for (const [param, type] of Object.entries(action.params)) {
    // Create sample values based on parameter type
    switch (type.toLowerCase()) {
      case "integer":
        result[param] = "1";
        break;
      case "number":
        result[param] = "1.0";
        break;
      case "boolean":
        result[param] = "true";
        break;
      case "array":
        result[param] = "[]";
        break;
      case "object":
        result[param] = "{}";
        break;
      default:
        // For path parameters, use a placeholder
        if (action.path.includes(`{${param}}`)) {
          result[param] = `"item-id"`;
        } else {
          result[param] = `"sample-${param}"`;
        }
    }
  }

  return result;
}
