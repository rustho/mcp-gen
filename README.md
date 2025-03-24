# MCP-Gen

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

## Installation

```bash
# Install globally
npm install -g mcp-gen

# Or use directly with npx
npx mcp-gen <swagger-file>
```

## Usage

```bash
# Basic usage - generates all outputs
mcp-gen path/to/swagger.yaml

# Specify output directory
mcp-gen path/to/swagger.yaml -o ./custom-output

# Generate only specific formats
mcp-gen path/to/swagger.yaml --prompt --functions

# Specify a particular endpoint for state schema
mcp-gen path/to/swagger.yaml --state-endpoint /status

# See all options
mcp-gen --help
```

## Output Files

Running the generator creates the following files:

- `generated.mcp.json`: The complete MCP JSON file with actions and state schema
- `prompt.txt`: Text instructions for AI models, including state information
- `templates.json`: JSON templates for each action, plus a getState action
- `functionSchemas.json`: OpenAI-compatible function schemas, with a getState function

## Example Output

### Prompt (prompt.txt)

```
You are an agent controlling an API. Here are the available actions:


- listPets (GET /pets): limit
- createPet (POST /pets): id, name, tag
- getPetById (GET /pets/{petId}): petId
- deletePet (DELETE /pets/{petId}): petId

System State Information:
The system maintains a state that can be queried. The state structure is:
List all pets (array of items)

Example state:
[
  {
    "id": 0,
    "name": "example",
    "tag": "example"
  }
]

You should return commands in JSON format, for example:
{
  "action": "listPets",
  "params": {
    "limit": "integer"
  }
}
```

## State Integration

The tool integrates state information into all exports:

1. **MCP JSON**: Includes a complete `stateSchema` section with structure and examples
2. **Prompt Text**: Describes the state structure and provides an example
3. **Function Schemas**: Adds a `getState` function for retrieving the current state
4. **Action Templates**: Includes a `getState` action with empty parameters

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
mcp-gen/
├── index.ts              // CLI entry point
├── parser.ts             // Swagger parsing
├── generator/
│   ├── extractor.ts      // Convert Swagger → actions
│   ├── extractState.ts   // Extract state schema
│   ├── mcpBuilder.ts     // Generate MCP JSON
│   ├── exporters/
│   │   ├── toPrompt.ts
│   │   ├── toFunctionSchemas.ts
│   │   └── toTemplates.ts
```

## License

[ISC](LICENSE) © 2025 (Rustho)[https://github.com/rustho]. Free to use, modify and distribute.
