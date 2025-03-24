import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Server configuration
const server = new McpServer({
  name: "Generated MCP",
  version: "1.0.0",
  description: "Auto-generated Model Control Protocol from OpenAPI"
});

// Using function registry pattern for better maintainability and testing
const toolDefinitions = [
  // List all pets
  {
    name: "listPets",
    description: "listPets (GET /pets)",
    schema: {
      limit: z.number().describe("limit")
    },
    handler: async (args) => {
      try {
        const queryParams = new URLSearchParams();
        queryParams.append("limit", String(args.limit));
        const res = await fetch(`https://api.example.com/pets${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
        const data = await res.json();
        return {
          content: [{ type: "text", text: JSON.stringify(data, null, 2) }]
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `Error: ${error.message}` }]
        };
      }
    }
  },

  // Create a pet
  {
    name: "createPet",
    description: "createPet (POST /pets)",
    schema: {
      id: z.number().describe("id"),
    name: z.string().describe("name"),
    tag: z.string().describe("tag")
    },
    handler: async (args) => {
      try {
        const res = await fetch(`https://api.example.com/pets`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(args)
        });
        const data = await res.json();
        return {
          content: [{ type: "text", text: JSON.stringify(data, null, 2) }]
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `Error: ${error.message}` }]
        };
      }
    }
  },

  // Info for a specific pet
  {
    name: "getPetById",
    description: "getPetById (GET /pets/{petId})",
    schema: {
      petId: z.string().describe("petId")
    },
    handler: async (args) => {
      try {
        const res = await fetch(`https://api.example.com/pets/${args.petId}`);
        const data = await res.json();
        return {
          content: [{ type: "text", text: JSON.stringify(data, null, 2) }]
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `Error: ${error.message}` }]
        };
      }
    }
  },

  // Delete a pet
  {
    name: "deletePet",
    description: "deletePet (DELETE /pets/{petId})",
    schema: {
      petId: z.string().describe("petId")
    },
    handler: async (args) => {
      try {
        const res = await fetch(`https://api.example.com/pets/${args.petId}`, {
          method: "DELETE"
        });
        const data = await res.json();
        return {
          content: [{ type: "text", text: JSON.stringify(data, null, 2) }]
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `Error: ${error.message}` }]
        };
      }
    }
  },
  // Get current state
  {
    name: "getState",
    description: "Get the current state of the system",
    schema: {},
    handler: async () => {
      try {
        const res = await fetch(`https://api.example.com`);
        const data = await res.json();
        return {
          content: [{ type: "text", text: JSON.stringify(data, null, 2) }]
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `Error: ${error.message}` }]
        };
      }
    }
  }
];

// Try to load custom handlers from handlers/ directory
try {
  // This allows users to add new tools or override existing ones 
  // by creating files in the handlers/ directory
  const fs = require('fs');
  const path = require('path');
  
  const handlersDir = path.resolve(__dirname, 'handlers');
  if (fs.existsSync(handlersDir)) {
    fs.readdirSync(handlersDir)
      .filter(file => file.endsWith('.js') || file.endsWith('.ts'))
      .filter(file => file !== 'index.js' && file !== 'index.ts' && !file.startsWith('README'))
      .forEach(file => {
        const handlerName = path.basename(file, path.extname(file));
        try {
          const handlerModule = require(`./handlers/${handlerName}`);
          
          // Check if this handler is replacing an existing one or adding a new one
          const existingToolIndex = toolDefinitions.findIndex(tool => tool.name === handlerName);
          
          if (existingToolIndex >= 0 && handlerModule.handler) {
            // Replace the handler but keep the name, description and schema
            console.log(`Using custom handler for ${handlerName}`);
            toolDefinitions[existingToolIndex].handler = handlerModule.handler;
            
            // Update schema if provided
            if (handlerModule.paramSchema) {
              toolDefinitions[existingToolIndex].schema = handlerModule.paramSchema;
            }
          } else if (handlerModule.handler) {
            // Add new tool
            console.log(`Adding custom tool: ${handlerName}`);
            toolDefinitions.push({
              name: handlerName,
              description: `Custom tool: ${handlerName}`,
              schema: handlerModule.paramSchema || {},
              handler: handlerModule.handler
            });
          }
        } catch (error) {
          console.error(`Error loading handler ${handlerName}: ${error.message}`);
        }
      });
  }
} catch (error) {
  console.error(`Error scanning for custom handlers: ${error.message}`);
}

// Register all tools with the server
toolDefinitions.forEach(tool => 
  server.tool(
    tool.name,
    tool.description,
    tool.schema,
    tool.handler
  )
);

// Start the server with stdio transport for Claude Desktop
server.registerTransport(new StdioServerTransport({ input: process.stdin, output: process.stdout }));
process.stdin.resume();