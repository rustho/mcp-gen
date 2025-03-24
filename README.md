# OpenAPI-to-MCP

Generate AI-friendly interfaces from your existing Swagger/OpenAPI specs.  
This tool converts APIs into Model Control Protocol (MCP) format — used to control tools and environments via large language models.

## Overview

This tool converts OpenAPI/Swagger specifications into Model Control Protocol (MCP) format, making it easy to create AI agents that can interact with your APIs.

## Features

- 📥 Generate universal mcp.json from OpenAPI/Swagger files
- 🔄 Auto-extract state schema from suitable GET endpoints
- 📤 Export to multiple formats:
  - 📜 Prompt instructions with state information
  - 🧱 JSON action templates with getState action
  - 🔧 Function schemas with getState function (OpenAI compatible)
  - 🚀 MCP server TypeScript file compatible with Claude Desktop
  - 🔌 Standalone executor for API interaction (LangChain/Web compatible)
  - 📂 Plug-and-play handler files with README
  - 🔗 LangChain tools with argsSchema and toolloader
  - 🔌 OpenAI plugin manifest with deployment instructions
- 🧪 Simulation mode for testing without backend changes

## Use Cases

- **Build Claude Desktop-compatible tools in seconds** — Generate an MCP server that works directly with Claude
- **Turn any OpenAPI spec into LangChain/AutoGPT tools** — Use the executor or LangChain tools for AI interfaces in any framework
- **Power AI interfaces for existing microservices** — No backend changes required, works with existing APIs
- **Create ChatGPT plugins effortlessly** — Generate OpenAI plugin manifests with proper schemas
- **Prototype AI agents with minimal setup** — Use simulation mode to test AI interaction with your API
- **Create custom handler logic** — Extend handlers with preprocessing, caching, or business logic

## Installation

```bash
# Install globally
npm install -g openapi-to-mcp

# Or use directly with npx
npx openapi-to-mcp <swagger-file>
```

## Usage

```bash
# Basic usage - generates all outputs
openapi-to-mcp path/to/swagger.yaml

# Specify output directory
openapi-to-mcp path/to/swagger.yaml -o ./custom-output

# Generate only specific formats
openapi-to-mcp path/to/swagger.yaml --prompt --functions

# Generate MCP server for Claude Desktop
openapi-to-mcp path/to/swagger.yaml --server --api-url https://your-api.com

# Generate standalone executor for any framework
openapi-to-mcp path/to/swagger.yaml --executor --api-url https://your-api.com

# Generate individual handler files for customization
openapi-to-mcp path/to/swagger.yaml --handlers --api-url https://your-api.com

# Generate LangChain tools for your API
openapi-to-mcp path/to/swagger.yaml --langchain --api-url https://your-api.com

# Generate OpenAI plugin manifest files
openapi-to-mcp path/to/swagger.yaml --openai-plugin --api-url https://your-api.com

# Specify a particular endpoint for state schema
openapi-to-mcp path/to/swagger.yaml --state-endpoint /status

# Simulate AI interaction with your API
openapi-to-mcp path/to/swagger.yaml --simulate "list all available pets" --api-url https://your-api.com

# Simulate using Claude instead of OpenAI (default)
openapi-to-mcp path/to/swagger.yaml --simulate "add a new pet" --provider claude --api-url https://your-api.com

# See all options
openapi-to-mcp --help
```

## Output Files

Running the generator creates the following files:

- `generated.mcp.json`: The MCP specification for your API
- `prompt.txt`: Prompt instructions for LLMs
- `templates.json`: JSON action templates
- `functionSchemas.json`: OpenAI-compatible function schemas
- `mcp-server.ts`: Ready-to-use TypeScript MCP server implementation for Claude Desktop
- `executor.ts`: Standalone executor for using API actions in any framework
- `handlers/`: Directory with individual handler implementations for each action
- `langchain-tools.ts`: Ready-to-use LangChain tools with Zod validation
- `langchain-toolloader.ts`: Helper for selective tool loading
- `.well-known/ai-plugin.json`: OpenAI plugin manifest file
- `OPENAI-PLUGIN-README.md`: Deployment instructions for the OpenAI plugin

## Using the Generated Files

### MCP Server for Claude Desktop

1. Install dependencies: `npm install @modelcontextprotocol/sdk zod`
2. Compile the server: `tsc mcp-server.ts --esModuleInterop --module nodenext`
3. Run with Claude Desktop: `claude tools register mcp-server.js`

### Standalone Executor

```typescript
// Example usage with any framework
import { ApiExecutor } from "./executor";

async function main() {
  const api = new ApiExecutor("https://your-api.com");

  // Get API state
  const state = await api.getState();
  console.log("Current state:", state);

  // Execute an action
  const result = await api.execute("listPets", { limit: 10 });
  console.log("Pets:", result);
}
```

### LangChain Tools

```typescript
// Example usage with LangChain
import { ChatOpenAI } from "langchain/chat_models/openai";
import { AgentExecutor, createStructuredChatAgent } from "langchain/agents";
import { loadTools } from "./langchain-toolloader";

async function main() {
  const model = new ChatOpenAI({
    temperature: 0,
    modelName: "gpt-4-turbo",
  });

  // Load all tools or specify which ones to load
  const tools = loadTools(["listPets", "getPet", "getState"]);

  const agent = createStructuredChatAgent({
    llm: model,
    tools,
  });

  const agentExecutor = new AgentExecutor({
    agent,
    tools,
  });

  const result = await agentExecutor.invoke({
    input:
      "What pets are available and can you show me details of pet with ID 1?",
  });

  console.log(result.output);
}
```

### OpenAI Plugin

Follow the instructions in `OPENAI-PLUGIN-README.md` to deploy your OpenAI plugin:

1. Host your API on a public server
2. Copy the `.well-known/ai-plugin.json` to your server
3. Ensure your OpenAPI spec is available at the URL specified in the plugin manifest
4. Register your plugin with OpenAI

### Simulation Mode

Simulation mode lets you test AI interaction with your API without requiring setup:

```bash
# Set your API key (required for simulation)
export OPENAI_API_KEY=your_key_here
# Or for Claude
export CLAUDE_API_KEY=your_key_here

# Run a simulation
openapi-to-mcp path/to/swagger.yaml --simulate "find pets with tag 'dog'" --api-url https://pet-api.com
```

This will:

1. Parse your OpenAPI spec
2. Generate necessary handler files
3. Send the request to the LLM with function schemas
4. Execute API call via the executor
5. Return the LLM's final response with data

## State Integration

The tool integrates state information into all exports:

1. **MCP JSON**: Includes a complete `stateSchema` section with structure and examples
2. **Prompt Text**: Describes the state structure and provides an example
3. **Function Schemas**: Adds a `getState` function for retrieving the current state
4. **Action Templates**: Includes a `getState` action with empty parameters
5. **Executor**: Includes a `getState()` method for retrieving current state
6. **Handler Files**: Includes a `getState.ts` handler file
7. **LangChain Tools**: Includes a `getState` tool for retrieving current state
8. **OpenAI Plugin**: Includes state description in the plugin manifest

## State Schema Detection

The tool automatically searches for suitable GET endpoints to use as state schema sources, with priority given to endpoints with names containing:

- state
- status
- scene
- objects
- tracks
- world

You can also manually specify an endpoint using the `--state-endpoint` option.

## Project Structure

```
openapi-to-mcp/
├── index.ts              // CLI entry point
├── parser.ts             // Swagger parsing
├── generator/
│   ├── extractor.ts      // Convert Swagger → actions
│   ├── extractState.ts   // Extract state schema
│   ├── mcpBuilder.ts     // Generate MCP JSON
│   ├── exporters/
│   │   ├── toPrompt.ts
│   │   ├── toFunctionSchemas.ts
│   │   ├── toTemplates.ts
│   │   ├── generateMcpServer.ts
│   │   ├── generateExecutor.ts
│   │   ├── generateHandlers.ts
│   │   ├── simulate.ts
│   │   ├── toLangChainTools.ts
│   │   └── toOpenAIPlugin.ts
```

## Development and Publishing

### Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the project:
   ```bash
   npm run build
   ```
4. Run locally:
   ```bash
   npm start -- path/to/swagger.yaml
   ```

### Publishing to npm

#### Manual Publishing

1. Log in to npm:
   ```bash
   npm login
   ```
2. Build and publish:
   ```bash
   npm run build
   npm publish --access public
   ```

#### Automated Publishing via GitHub Actions

This project uses GitHub Actions for CI/CD to automatically publish new versions to npm when a new tag is pushed:

1. Update version in package.json:

   ```bash
   npm version patch   # or minor/major
   ```

   This will automatically create a git tag.

2. Push the new tag to GitHub:

   ```bash
   git push origin --tags
   ```

3. The GitHub Action will trigger and publish the new version to npm.

### Setting up CI/CD for Your Fork

If you fork this project, you'll need to set up your own npm publishing:

1. Create an npm account and get an access token from npmjs.com → Access Tokens
2. Add this token to your GitHub repository as a secret named `NPM_TOKEN`
3. Update the package name in package.json to avoid conflicts

## Contributing

We welcome contributions from the community! Please read our [contribution guidelines](CONTRIBUTING.md) before submitting a pull request.

## License

[ISC](LICENSE) © 2025 [Rustho](https://github.com/rustho). Free to use, modify and distribute.
