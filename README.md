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

# Specify a particular endpoint for state schema
openapi-to-mcp path/to/swagger.yaml --state-endpoint /status

# See all options
openapi-to-mcp --help
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
│   │   └── toTemplates.ts
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
