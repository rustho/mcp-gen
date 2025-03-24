import { MCPJson } from "../types";
import path from "path";
import fs from "fs";

/**
 * Generates OpenAI plugin configuration files based on MCP specification
 * 
 * @param mcpJson The MCP JSON structure
 * @param outputDir Output directory
 * @param apiBaseUrl Base URL for the API
 * @param openapiPath Path to the OpenAPI spec file (relative to domain)
 */
export function generateOpenAIPlugin(
  mcpJson: MCPJson,
  outputDir: string,
  apiBaseUrl: string,
  openapiPath: string = "/openapi.yaml"
) {
  // Ensure the .well-known directory exists
  const wellKnownDir = path.join(outputDir, ".well-known");
  if (!fs.existsSync(wellKnownDir)) {
    fs.mkdirSync(wellKnownDir, { recursive: true });
  }

  // Generate ai-plugin.json
  const pluginManifest = generatePluginManifest(mcpJson, apiBaseUrl, openapiPath);
  const pluginPath = path.join(wellKnownDir, "ai-plugin.json");
  fs.writeFileSync(pluginPath, JSON.stringify(pluginManifest, null, 2));

  // Generate README with deployment instructions
  const readmePath = path.join(outputDir, "OPENAI-PLUGIN-README.md");
  fs.writeFileSync(readmePath, generatePluginReadme(mcpJson, apiBaseUrl));

  console.log(`📝 OpenAI plugin manifest generated at: ${pluginPath}`);
  console.log(`📝 OpenAI plugin README generated at: ${readmePath}`);
}

/**
 * Generates the OpenAI plugin manifest
 */
function generatePluginManifest(
  mcpJson: MCPJson, 
  apiBaseUrl: string,
  openapiPath: string
): any {
  const baseUrl = apiBaseUrl.endsWith("/")
    ? apiBaseUrl.slice(0, -1)
    : apiBaseUrl;

  // Convert API name to a model-friendly name (lowercase with underscores)
  const nameForModel = mcpJson.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");

  return {
    "schema_version": "v1",
    "name_for_human": mcpJson.name,
    "name_for_model": nameForModel,
    "description_for_human": mcpJson.description,
    "description_for_model": generateModelDescription(mcpJson),
    "auth": {
      "type": "none"
    },
    "api": {
      "type": "openapi",
      "url": `${baseUrl}${openapiPath}`
    },
    "logo_url": `${baseUrl}/logo.png`,
    "contact_email": "contact@example.com",
    "legal_info_url": `${baseUrl}/legal`
  };
}

/**
 * Generates a comprehensive description for the model including available actions
 */
function generateModelDescription(mcpJson: MCPJson): string {
  let description = `${mcpJson.description}\n\nThis plugin provides the following capabilities:\n`;
  
  // Add all actions
  mcpJson.actions?.forEach((action) => {
    const actionDesc = action.description || `${action.method} ${action.path}`;
    description += `- ${action.action}: ${actionDesc}\n`;
  });
  
  // Add state info if available
  if (mcpJson.stateSchema) {
    description += `\nThe plugin also provides access to system state information via the ${mcpJson.stateSchema.endpoint || "/state"} endpoint.`;
  }
  
  return description;
}

/**
 * Generates a README with deployment instructions
 */
function generatePluginReadme(mcpJson: MCPJson, apiBaseUrl: string): string {
  return `# OpenAI Plugin for ${mcpJson.name}

This directory contains an OpenAI plugin manifest for the ${mcpJson.name} API.

## Deployment Instructions

To deploy this as an OpenAI plugin, follow these steps:

1. **Host your API**
   
   Make sure your API is publicly accessible at ${apiBaseUrl}

2. **Copy plugin files to your server**
   
   - Copy the \`.well-known/ai-plugin.json\` file to your server
   - Ensure your OpenAPI specification is available at \`/openapi.yaml\` 
     (or update the URL in the ai-plugin.json file)
   - Add a \`logo.png\` file (ideally 512x512px) to your server root
   - Add a \`legal\` page with your terms of service

3. **Verify your plugin**
   
   - Test that \`${apiBaseUrl}/.well-known/ai-plugin.json\` is accessible
   - Make sure \`${apiBaseUrl}/logo.png\` is accessible
   - Check that \`${apiBaseUrl}/openapi.yaml\` returns your API specification

4. **Register with OpenAI**
   
   - Go to [OpenAI's plugins page](https://platform.openai.com/docs/plugins/getting-started)
   - Submit your plugin for review
   - After approval, users can install your plugin through the ChatGPT interface

## Customization

Make sure to customize the following in \`ai-plugin.json\`:

- \`contact_email\`: Your contact email
- \`legal_info_url\`: URL to your terms of service
- \`logo_url\`: URL to your plugin logo

## Testing Locally

You can test your plugin locally by:

1. Using a tool like ngrok to expose your local server
2. Following OpenAI's documentation for running your plugin in development mode

## Support

For issues or questions regarding this plugin, please refer to the OpenAI Plugins documentation 
or contact the API provider.
`;
} 