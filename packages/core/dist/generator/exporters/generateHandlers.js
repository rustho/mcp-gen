"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateHandlers = generateHandlers;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
/**
 * Generates separate handler files for each action in the MCP JSON
 */
function generateHandlers(mcpJson, outputPath, apiBaseUrl) {
    // Create handlers directory if it doesn't exist
    const handlersDir = path_1.default.resolve(outputPath, 'handlers');
    if (!fs_1.default.existsSync(handlersDir)) {
        fs_1.default.mkdirSync(handlersDir, { recursive: true });
    }
    // If there are no actions, just create the README
    if (!mcpJson.actions || mcpJson.actions.length === 0) {
        generateReadme(mcpJson, handlersDir);
        return;
    }
    // Generate a handler file for each action
    console.log(`📂 Generating handler files in ${path_1.default.join(outputPath, 'handlers/')}`);
    mcpJson.actions.forEach(action => {
        generateHandlerFile(action, handlersDir, apiBaseUrl);
    });
    // Generate a state handler if there's a state schema
    if (mcpJson.stateSchema) {
        generateStateHandler(mcpJson, handlersDir, apiBaseUrl);
    }
    // Generate README with instructions
    generateReadme(mcpJson, handlersDir);
}
/**
 * Generates a handler file for a specific action
 */
function generateHandlerFile(action, handlersDir, apiBaseUrl) {
    const handlerCode = `/**
 * Handler for ${action.action}
 * ${action.description || ''}
 * 
 * HTTP Method: ${action.method}
 * Path: ${action.path}
 */
import { z } from "zod";

// Parameter schema definition
export const paramSchema = {
${Object.entries(action.params || {})
        .map(([name, type]) => `  ${name}: z.${mapTypeToZod(type)}.describe("${name}")`)
        .join(',\n')}
};

// Implementation of the handler
export async function handler(params: any) {
  // Access to the executor's baseUrl
  const baseUrl = this.baseUrl || "${apiBaseUrl}";
  
  ${generateHandlerImplementation(action, apiBaseUrl)}
}

/**
 * Example of how to use this handler:
 * 
 * import { handler } from "./handlers/${action.action}";
 * 
 * // Create params object with all required fields
 * const params = {
${Object.keys(action.params || {})
        .map(param => `   ${param}: ${generateExampleValue(param, action.params[param], action.path)}`)
        .join(',\n')}
 * };
 * 
 * // Call the handler
 * handler(params).then(result => {
 *   console.log("Result:", result);
 * }).catch(error => {
 *   console.error("Error:", error);
 * });
 */
`;
    const handlerFilePath = path_1.default.resolve(handlersDir, `${action.action}.ts`);
    fs_1.default.writeFileSync(handlerFilePath, handlerCode);
}
/**
 * Generates a state handler file if stateSchema is defined
 */
function generateStateHandler(mcpJson, handlersDir, apiBaseUrl) {
    const stateSchema = mcpJson.stateSchema;
    const handlerCode = `/**
 * Handler for getState
 * Retrieves the current state of the system
 * 
 * Based on: ${stateSchema.description}
 */
import { z } from "zod";

// Parameter schema definition
export const paramSchema = {};

// Implementation of the handler
export async function handler() {
  // Access to the executor's baseUrl
  const baseUrl = this.baseUrl || "${apiBaseUrl}";
  
  try {
    const response = await fetch(\`\${baseUrl}${stateSchema.endpoint || ''}\`);
    if (!response.ok) {
      throw new Error(\`Failed to fetch state: \${response.status} \${response.statusText}\`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching state:", error);
    throw error;
  }
}

/**
 * Example of state schema:
 *
 * ${JSON.stringify(stateSchema.properties || {}, null, 2).replace(/^/gm, ' * ')}
 */
`;
    const handlerFilePath = path_1.default.resolve(handlersDir, `getState.ts`);
    fs_1.default.writeFileSync(handlerFilePath, handlerCode);
}
/**
 * Generate README file with instructions for using and extending handlers
 */
function generateReadme(mcpJson, handlersDir) {
    const readmeContent = `# API Handlers for ${mcpJson.name}

This directory contains individual handler files for each API action defined in the MCP specification.
Each file provides an implementation of a single API endpoint and can be customized as needed.

## How to Use Handlers

Each handler file exports two main components:

1. \`paramSchema\`: A Zod schema that defines the parameters for the action
2. \`handler\`: An async function that implements the action

Handlers can be used directly or imported by the executor:

\`\`\`typescript
// Direct usage
import { handler } from './handlers/actionName';

const result = await handler({ paramName: 'value' });
console.log(result);

// Usage with executor
import { ApiExecutor } from '../executor';

const api = new ApiExecutor('https://api.example.com');
const result = await api.execute('actionName', { paramName: 'value' });
console.log(result);
\`\`\`

## Customizing Handlers

You can modify any handler file to customize its behavior. For example:

\`\`\`typescript
// Original handler in listItems.ts
export async function handler(params: any) {
  const baseUrl = this.baseUrl || "https://api.example.com";
  const response = await fetch(\`\${baseUrl}/items\`);
  return await response.json();
}

// Modified handler with additional logic
export async function handler(params: any) {
  const baseUrl = this.baseUrl || "https://api.example.com";
  
  // Add caching
  const cacheKey = \`items-\${JSON.stringify(params)}\`;
  const cached = localStorage.getItem(cacheKey);
  
  if (cached) {
    return JSON.parse(cached);
  }
  
  const response = await fetch(\`\${baseUrl}/items\`);
  const data = await response.json();
  
  // Store in cache
  localStorage.setItem(cacheKey, JSON.stringify(data));
  
  return data;
}
\`\`\`

## Available Handlers

${mcpJson.actions && mcpJson.actions.length > 0
        ? mcpJson.actions.map(action => `- \`${action.action}.ts\`: ${action.description || `${action.method} ${action.path}`}`).join('\n')
        : '- No actions defined'}
${mcpJson.stateSchema ? '\n- `getState.ts`: Retrieve the current state of the system' : ''}

## Adding New Handlers

You can add new handlers by creating new TypeScript files in this directory. The filename should match the action name, and the file should export a \`handler\` function.

\`\`\`typescript
// Example new handler: customAction.ts

import { z } from "zod";

export const paramSchema = {
  id: z.string().describe("Item ID"),
  action: z.string().describe("Action to perform")
};

export async function handler(params: any) {
  // Implementation
  const { id, action } = params;
  
  // Do something with the parameters
  return { success: true, id, action };
}
\`\`\`

The executor will automatically detect and use your custom handlers when they're in this directory.
`;
    const readmePath = path_1.default.resolve(handlersDir, 'README.md');
    fs_1.default.writeFileSync(readmePath, readmeContent);
}
/**
 * Maps OpenAPI/MCP parameter types to Zod validators
 */
function mapTypeToZod(type) {
    switch (type.toLowerCase()) {
        case 'integer':
            return 'number()';
        case 'number':
            return 'number()';
        case 'boolean':
            return 'boolean()';
        case 'array':
            return 'array(z.any())';
        case 'object':
            return 'record(z.any())';
        default:
            return 'string()';
    }
}
/**
 * Generate an example value for a parameter for use in the example section
 */
function generateExampleValue(paramName, type, path) {
    // Check if the parameter is part of the path
    const isPathParam = path.includes(`{${paramName}}`);
    switch (type.toLowerCase()) {
        case 'integer':
            return isPathParam ? '"1"' : '42';
        case 'number':
            return isPathParam ? '"1.5"' : '42.5';
        case 'boolean':
            return 'true';
        case 'array':
            return '[]';
        case 'object':
            return '{}';
        default:
            return isPathParam ? `"item-id"` : `"example-${paramName}"`;
    }
}
/**
 * Generate handler implementation based on the HTTP method
 */
function generateHandlerImplementation(action, apiBaseUrl) {
    // Get path parameters from the URL path
    const pathParams = (action.path.match(/{([^}]+)}/g) || [])
        .map(param => param.substring(1, param.length - 1));
    // Get query parameters (parameters that aren't in the path)
    const queryParams = action.params
        ? Object.keys(action.params).filter(param => !pathParams.includes(param))
        : [];
    // Format the path with template strings for path parameters
    const formattedPath = action.path.replace(/{([^}]+)}/g, '${params.$1}');
    // Implementation based on HTTP method
    switch (action.method) {
        case 'GET':
            if (queryParams.length > 0) {
                return `try {
    // Build query string from parameters
    const queryString = new URLSearchParams();
    ${queryParams.map(param => `if (params.${param} !== undefined) queryString.append("${param}", String(params.${param}));`).join('\n    ')}
    
    // Make API request
    const response = await fetch(\`\${baseUrl}${formattedPath}\${queryString.toString() ? \`?\${queryString.toString()}\` : ''}\`);
    
    if (!response.ok) {
      throw new Error(\`API request failed: \${response.status} \${response.statusText}\`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error executing ${action.action}:", error);
    throw error;
  }`;
            }
            else {
                return `try {
    // Make API request
    const response = await fetch(\`\${baseUrl}${formattedPath}\`);
    
    if (!response.ok) {
      throw new Error(\`API request failed: \${response.status} \${response.statusText}\`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error executing ${action.action}:", error);
    throw error;
  }`;
            }
        case 'POST':
        case 'PUT':
        case 'PATCH':
            return `try {
    // Remove path parameters from the body
    const bodyParams = {...params};
    ${pathParams.map(param => `delete bodyParams.${param};`).join('\n    ')}
    
    // Make API request
    const response = await fetch(\`\${baseUrl}${formattedPath}\`, {
      method: "${action.method}",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(bodyParams)
    });
    
    if (!response.ok) {
      throw new Error(\`API request failed: \${response.status} \${response.statusText}\`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error executing ${action.action}:", error);
    throw error;
  }`;
        case 'DELETE':
            return `try {
    // Make API request
    const response = await fetch(\`\${baseUrl}${formattedPath}\`, {
      method: "DELETE"
    });
    
    if (!response.ok) {
      throw new Error(\`API request failed: \${response.status} \${response.statusText}\`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error executing ${action.action}:", error);
    throw error;
  }`;
        default:
            return `try {
    // Make API request
    const response = await fetch(\`\${baseUrl}${formattedPath}\`, {
      method: "${action.method}"
    });
    
    if (!response.ok) {
      throw new Error(\`API request failed: \${response.status} \${response.statusText}\`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error executing ${action.action}:", error);
    throw error;
  }`;
    }
}
//# sourceMappingURL=generateHandlers.js.map