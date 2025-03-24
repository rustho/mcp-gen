# MCP Swagger Playground

A Next.js application for testing and exploring MCP (Model-Caller Protocol) commands with OpenAPI.

## Features

- **Text to MCP**: Convert natural language to MCP commands using AI
- **Execute API Calls**: Test MCP commands against an API
- **MCP Wrapper**: Format API calls as MCP tool calls
- **Demo Mode**: Test functionality without an API key using sample data

## Getting Started

### Prerequisites

- Node.js 18+ installed
- An OpenAI API key (for the prompt feature in API mode)

### Installation

1. Clone this repository
2. Navigate to the playground directory
3. Install dependencies

```bash
cd openapi-to-mcp/examples/playground
npm install
```

4. Create a `.env.local` file with the following environment variables (only needed for API mode):

```
OPENAI_API_KEY=your_openai_api_key_here
API_BASE_URL=https://your-openapi-base-url.com
OPENAI_MODEL=gpt-4-turbo # or any other model you want to use
```

### Running locally

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) to see the playground.

## Usage

### Mode Selection
The playground offers two modes:

1. **Demo Mode**: Use sample data without requiring an API key
   - Perfect for testing and learning
   - Includes predefined responses for common operations
   - No API key required

2. **API Mode**: Connect to real API endpoints
   - Requires valid API key
   - Makes actual API calls
   - Full functionality with real data

### Prompt Tab
Enter natural language text to convert it to an MCP command:

```
Find all available dogs for adoption
```

In demo mode, this will return a sample MCP command. In API mode, it will use AI to generate the appropriate command.

### Execute Tab
Enter a JSON MCP command to execute it:

```json
{
  "action": "findPetsByStatus",
  "params": {
    "status": "available",
  }
}
```

In demo mode, this will return sample data. In API mode, it will make a real API call.

### MCP Tab
Enter action and params to get a formatted MCP tool call response:

```json
{
  "action": "getPet",
  "params": {
    "petId": 123
  }
}
```

## Demo Mode Examples

The demo mode includes sample data for the following operations:

- `getPet`: Returns a sample pet with ID 1
- `listPets`: Returns a list of two sample pets
- `createPet`: Returns a sample newly created pet

## Deployment

This project can be easily deployed to Vercel:

1. Push to a GitHub repository
2. Connect to Vercel
3. Configure environment variables (for API mode)
4. Deploy

## Customizing the Prompt

Edit the `public/prompt.txt` file to customize how the AI converts text to MCP commands.

## Customizing API Endpoints

Modify `lib/executor.ts` to match your OpenAPI specification and implement the proper endpoints. 