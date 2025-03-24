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
  // Update an existing pet.
  {
    name: "updatePet",
    description: "updatePet (PUT /pet)",
    schema: {
      id: z.number().describe("id"),
    name: z.string().describe("name"),
    category: z.record(z.any()).describe("category"),
    photoUrls: z.array(z.any()).describe("photoUrls"),
    tags: z.array(z.any()).describe("tags"),
    status: z.string().describe("status")
    },
    handler: async (args) => {
      try {
        const res = await fetch(`https://petstore3.swagger.io/api/v3/pet`, {
          method: "PUT",
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

  // Add a new pet to the store.
  {
    name: "addPet",
    description: "addPet (POST /pet)",
    schema: {
      id: z.number().describe("id"),
    name: z.string().describe("name"),
    category: z.record(z.any()).describe("category"),
    photoUrls: z.array(z.any()).describe("photoUrls"),
    tags: z.array(z.any()).describe("tags"),
    status: z.string().describe("status")
    },
    handler: async (args) => {
      try {
        const res = await fetch(`https://petstore3.swagger.io/api/v3/pet`, {
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

  // Finds Pets by status.
  {
    name: "findPetsByStatus",
    description: "findPetsByStatus (GET /pet/findByStatus)",
    schema: {
      status: z.string().describe("status")
    },
    handler: async (args) => {
      try {
        const queryParams = new URLSearchParams();
        queryParams.append("status", String(args.status));
        const res = await fetch(`https://petstore3.swagger.io/api/v3/pet/findByStatus${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
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

  // Finds Pets by tags.
  {
    name: "findPetsByTags",
    description: "findPetsByTags (GET /pet/findByTags)",
    schema: {
      tags: z.array(z.any()).describe("tags")
    },
    handler: async (args) => {
      try {
        const queryParams = new URLSearchParams();
        queryParams.append("tags", String(args.tags));
        const res = await fetch(`https://petstore3.swagger.io/api/v3/pet/findByTags${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
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

  // Find pet by ID.
  {
    name: "getPetById",
    description: "getPetById (GET /pet/{petId})",
    schema: {
      petId: z.number().describe("petId")
    },
    handler: async (args) => {
      try {
        const res = await fetch(`https://petstore3.swagger.io/api/v3/pet/${args.petId}`);
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

  // Updates a pet in the store with form data.
  {
    name: "updatePetWithForm",
    description: "updatePetWithForm (POST /pet/{petId})",
    schema: {
      petId: z.number().describe("petId"),
    name: z.string().describe("name"),
    status: z.string().describe("status")
    },
    handler: async (args) => {
      try {
        const res = await fetch(`https://petstore3.swagger.io/api/v3/pet/${args.petId}`, {
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

  // Deletes a pet.
  {
    name: "deletePet",
    description: "deletePet (DELETE /pet/{petId})",
    schema: {
      api_key: z.string().describe("api_key"),
    petId: z.number().describe("petId")
    },
    handler: async (args) => {
      try {
        const res = await fetch(`https://petstore3.swagger.io/api/v3/pet/${args.petId}`, {
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

  // Uploads an image.
  {
    name: "uploadFile",
    description: "uploadFile (POST /pet/{petId}/uploadImage)",
    schema: {
      petId: z.number().describe("petId"),
    additionalMetadata: z.string().describe("additionalMetadata")
    },
    handler: async (args) => {
      try {
        const res = await fetch(`https://petstore3.swagger.io/api/v3/pet/${args.petId}/uploadImage`, {
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

  // Returns pet inventories by status.
  {
    name: "getInventory",
    description: "getInventory (GET /store/inventory)",
    schema: {
      
    },
    handler: async (args) => {
      try {
        const res = await fetch(`https://petstore3.swagger.io/api/v3/store/inventory`);
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

  // Place an order for a pet.
  {
    name: "placeOrder",
    description: "placeOrder (POST /store/order)",
    schema: {
      id: z.number().describe("id"),
    petId: z.number().describe("petId"),
    quantity: z.number().describe("quantity"),
    shipDate: z.string().describe("shipDate"),
    status: z.string().describe("status"),
    complete: z.boolean().describe("complete")
    },
    handler: async (args) => {
      try {
        const res = await fetch(`https://petstore3.swagger.io/api/v3/store/order`, {
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

  // Find purchase order by ID.
  {
    name: "getOrderById",
    description: "getOrderById (GET /store/order/{orderId})",
    schema: {
      orderId: z.number().describe("orderId")
    },
    handler: async (args) => {
      try {
        const res = await fetch(`https://petstore3.swagger.io/api/v3/store/order/${args.orderId}`);
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

  // Delete purchase order by identifier.
  {
    name: "deleteOrder",
    description: "deleteOrder (DELETE /store/order/{orderId})",
    schema: {
      orderId: z.number().describe("orderId")
    },
    handler: async (args) => {
      try {
        const res = await fetch(`https://petstore3.swagger.io/api/v3/store/order/${args.orderId}`, {
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

  // Create user.
  {
    name: "createUser",
    description: "createUser (POST /user)",
    schema: {
      id: z.number().describe("id"),
    username: z.string().describe("username"),
    firstName: z.string().describe("firstName"),
    lastName: z.string().describe("lastName"),
    email: z.string().describe("email"),
    password: z.string().describe("password"),
    phone: z.string().describe("phone"),
    userStatus: z.number().describe("userStatus")
    },
    handler: async (args) => {
      try {
        const res = await fetch(`https://petstore3.swagger.io/api/v3/user`, {
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

  // Creates list of users with given input array.
  {
    name: "createUsersWithListInput",
    description: "createUsersWithListInput (POST /user/createWithList)",
    schema: {
      
    },
    handler: async (args) => {
      try {
        const res = await fetch(`https://petstore3.swagger.io/api/v3/user/createWithList`, {
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

  // Logs user into the system.
  {
    name: "loginUser",
    description: "loginUser (GET /user/login)",
    schema: {
      username: z.string().describe("username"),
    password: z.string().describe("password")
    },
    handler: async (args) => {
      try {
        const queryParams = new URLSearchParams();
        queryParams.append("username", String(args.username));
        queryParams.append("password", String(args.password));
        const res = await fetch(`https://petstore3.swagger.io/api/v3/user/login${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
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

  // Logs out current logged in user session.
  {
    name: "logoutUser",
    description: "logoutUser (GET /user/logout)",
    schema: {
      
    },
    handler: async (args) => {
      try {
        const res = await fetch(`https://petstore3.swagger.io/api/v3/user/logout`);
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

  // Get user by user name.
  {
    name: "getUserByName",
    description: "getUserByName (GET /user/{username})",
    schema: {
      username: z.string().describe("username")
    },
    handler: async (args) => {
      try {
        const res = await fetch(`https://petstore3.swagger.io/api/v3/user/${args.username}`);
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

  // Update user resource.
  {
    name: "updateUser",
    description: "updateUser (PUT /user/{username})",
    schema: {
      username: z.string().describe("username"),
    id: z.number().describe("id"),
    firstName: z.string().describe("firstName"),
    lastName: z.string().describe("lastName"),
    email: z.string().describe("email"),
    password: z.string().describe("password"),
    phone: z.string().describe("phone"),
    userStatus: z.number().describe("userStatus")
    },
    handler: async (args) => {
      try {
        const res = await fetch(`https://petstore3.swagger.io/api/v3/user/${args.username}`, {
          method: "PUT",
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

  // Delete user resource.
  {
    name: "deleteUser",
    description: "deleteUser (DELETE /user/{username})",
    schema: {
      username: z.string().describe("username")
    },
    handler: async (args) => {
      try {
        const res = await fetch(`https://petstore3.swagger.io/api/v3/user/${args.username}`, {
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
        const res = await fetch(`https://petstore3.swagger.io/api/v3`);
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