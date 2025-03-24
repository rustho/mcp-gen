import { MCPJson } from "../types";
import path from "path";
import fs from "fs";

/**
 * Generates a TypeScript file with LangChain tools based on MCP specification
 * 
 * @param mcpJson The MCP JSON structure
 * @param outputDir Output directory
 * @param apiBaseUrl Base URL for the API
 */
export function generateLangChainTools(
  mcpJson: MCPJson,
  outputDir: string,
  apiBaseUrl: string
) {
  // Ensure the output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const toolsOutputPath = path.join(outputDir, "langchain-tools.ts");
  const loaderOutputPath = path.join(outputDir, "langchain-toolloader.ts");

  // Generate the tools file
  const toolsFileContent = generateToolsFile(mcpJson, apiBaseUrl);
  fs.writeFileSync(toolsOutputPath, toolsFileContent);
  
  // Generate the tool loader file
  const loaderFileContent = generateToolLoaderFile(mcpJson);
  fs.writeFileSync(loaderOutputPath, loaderFileContent);

  console.log(`📝 LangChain tools generated at: ${toolsOutputPath}`);
  console.log(`📝 LangChain tool loader generated at: ${loaderOutputPath}`);
}

/**
 * Generates the main LangChain tools file
 */
function generateToolsFile(mcpJson: MCPJson, apiBaseUrl: string): string {
  const baseUrl = apiBaseUrl.endsWith("/")
    ? apiBaseUrl.slice(0, -1)
    : apiBaseUrl;

  // Import statements
  let content = `import { z } from "zod";
import { Tool } from "langchain/tools";

/**
 * LangChain tools for the ${mcpJson.name} API
 * Generated from ${mcpJson.metadata.source || "MCP specification"}
 * 
 * ${mcpJson.description}
 */
export const tools: Tool[] = [\n`;

  // Generate tool for each action
  mcpJson.actions?.forEach((action) => {
    const description = action.description || `${action.method} ${action.path}`;
    
    // Create zod schema for parameters
    let zodSchema = "z.object({";
    const params = Object.entries(action.params || {});

    if (params.length > 0) {
      params.forEach(([paramName, paramType], index) => {
        const isRequired = true; // Assuming all parameters are required for simplicity
        const paramSchema = getZodType(paramType);
        zodSchema += `\n    ${paramName}: ${paramSchema}.describe("${paramName}")${isRequired ? "" : ".optional()"}`;
        if (index < params.length - 1) {
          zodSchema += ",";
        }
      });
      zodSchema += "\n  })";
    } else {
      zodSchema += "})";
    }

    // Create tool implementation
    content += `  {
    name: "${action.action}",
    description: "${description}",
    argsSchema: ${zodSchema},
    func: async (${params.length > 0 ? "params" : "_"}) => {
      try {
        // Extract path parameters and create URL
        let url = \`${baseUrl}${action.path.replace(/{([^}]+)}/g, "${params.$1}")}\`;
        
        // Handle query parameters for GET requests
        ${
          action.method.toUpperCase() === "GET" && params.length > 0
            ? `const queryParams = new URLSearchParams();
        ${Object.keys(action.params || {})
          .filter(param => !action.path.includes(`{${param}}`))
          .map(param => `if (params.${param} !== undefined) queryParams.append("${param}", params.${param}.toString());`)
          .join("\n        ")}
        
        // Append query string if there are any query parameters
        const queryString = queryParams.toString();
        if (queryString) {
          url += \`?\${queryString}\`;
        }`
            : ""
        }

        // Make the API request
        ${
          action.method.toUpperCase() === "GET"
            ? `const response = await fetch(url);`
            : `const response = await fetch(url, {
          method: "${action.method.toUpperCase()}",
          headers: {
            "Content-Type": "application/json",
          },
          ${
            action.method.toUpperCase() !== "DELETE"
              ? `body: JSON.stringify(${
                  params.filter(param => !action.path.includes(`{${param[0]}}`)).length > 0
                    ? "params"
                    : "{}"
                }),`
              : ""
          }
        });`
        }

        // Parse and return the response
        const data = await response.json();
        return JSON.stringify(data);
      } catch (error) {
        return JSON.stringify({ error: error.message || "An error occurred" });
      }
    }
  },\n`;
  });

  // Add getState tool if state schema exists
  if (mcpJson.stateSchema) {
    content += `  {
    name: "getState",
    description: "Get the current state of the system",
    argsSchema: z.object({}),
    func: async () => {
      try {
        const response = await fetch(\`${baseUrl}${mcpJson.stateSchema.endpoint || "/state"}\`);
        const data = await response.json();
        return JSON.stringify(data);
      } catch (error) {
        return JSON.stringify({ error: error.message || "An error occurred" });
      }
    }
  },\n`;
  }

  content += "];\n";
  return content;
}

/**
 * Generates a tool loader file to help users select specific tools
 */
function generateToolLoaderFile(mcpJson: MCPJson): string {
  let content = `import { Tool } from "langchain/tools";
import { tools as allTools } from "./langchain-tools";

/**
 * Helper to load specific tools from the ${mcpJson.name} API
 * 
 * @param toolNames Names of the tools to load, or "all" to load all tools
 * @returns Array of LangChain Tool instances
 */
export function loadTools(toolNames: string[] | "all" = "all"): Tool[] {
  if (toolNames === "all") {
    return allTools;
  }
  
  return allTools.filter(tool => toolNames.includes(tool.name));
}

/**
 * Available tool names:
 */
export const availableTools = [\n`;

  // Add all action names
  mcpJson.actions?.forEach((action) => {
    content += `  "${action.action}",\n`;
  });

  // Add getState if available
  if (mcpJson.stateSchema) {
    content += `  "getState",\n`;
  }

  content += "];\n";
  return content;
}

/**
 * Map OpenAPI/MCP types to Zod schema types
 */
function getZodType(type: string): string {
  switch (type.toLowerCase()) {
    case "integer":
      return "z.number().int()";
    case "number":
      return "z.number()";
    case "boolean":
      return "z.boolean()";
    case "array":
      return "z.array(z.any())";
    case "object":
      return "z.record(z.string(), z.any())";
    default:
      return "z.string()";
  }
} 