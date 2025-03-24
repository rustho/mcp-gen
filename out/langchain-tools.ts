import { z } from "zod";
import { Tool } from "langchain/tools";

/**
 * LangChain tools for the Generated MCP API
 * Generated from OpenAPI 3.0
 * 
 * Auto-generated Model Control Protocol from OpenAPI
 */
export const tools: Tool[] = [
  {
    name: "updatePet",
    description: "Update an existing pet.",
    argsSchema: z.object({
    id: z.number().int().describe("id"),
    name: z.string().describe("name"),
    category: z.record(z.string(), z.any()).describe("category"),
    photoUrls: z.array(z.any()).describe("photoUrls"),
    tags: z.array(z.any()).describe("tags"),
    status: z.string().describe("status")
  }),
    func: async (params) => {
      try {
        // Extract path parameters and create URL
        let url = `https://petstore3.swagger.io/api/v3/pet`;
        
        // Handle query parameters for GET requests
        

        // Make the API request
        const response = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(params),
        });

        // Parse and return the response
        const data = await response.json();
        return JSON.stringify(data);
      } catch (error) {
        return JSON.stringify({ error: error.message || "An error occurred" });
      }
    }
  },
  {
    name: "addPet",
    description: "Add a new pet to the store.",
    argsSchema: z.object({
    id: z.number().int().describe("id"),
    name: z.string().describe("name"),
    category: z.record(z.string(), z.any()).describe("category"),
    photoUrls: z.array(z.any()).describe("photoUrls"),
    tags: z.array(z.any()).describe("tags"),
    status: z.string().describe("status")
  }),
    func: async (params) => {
      try {
        // Extract path parameters and create URL
        let url = `https://petstore3.swagger.io/api/v3/pet`;
        
        // Handle query parameters for GET requests
        

        // Make the API request
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(params),
        });

        // Parse and return the response
        const data = await response.json();
        return JSON.stringify(data);
      } catch (error) {
        return JSON.stringify({ error: error.message || "An error occurred" });
      }
    }
  },
  {
    name: "findPetsByStatus",
    description: "Finds Pets by status.",
    argsSchema: z.object({
    status: z.string().describe("status")
  }),
    func: async (params) => {
      try {
        // Extract path parameters and create URL
        let url = `https://petstore3.swagger.io/api/v3/pet/findByStatus`;
        
        // Handle query parameters for GET requests
        const queryParams = new URLSearchParams();
        if (params.status !== undefined) queryParams.append("status", params.status.toString());
        
        // Append query string if there are any query parameters
        const queryString = queryParams.toString();
        if (queryString) {
          url += `?${queryString}`;
        }

        // Make the API request
        const response = await fetch(url);

        // Parse and return the response
        const data = await response.json();
        return JSON.stringify(data);
      } catch (error) {
        return JSON.stringify({ error: error.message || "An error occurred" });
      }
    }
  },
  {
    name: "findPetsByTags",
    description: "Finds Pets by tags.",
    argsSchema: z.object({
    tags: z.array(z.any()).describe("tags")
  }),
    func: async (params) => {
      try {
        // Extract path parameters and create URL
        let url = `https://petstore3.swagger.io/api/v3/pet/findByTags`;
        
        // Handle query parameters for GET requests
        const queryParams = new URLSearchParams();
        if (params.tags !== undefined) queryParams.append("tags", params.tags.toString());
        
        // Append query string if there are any query parameters
        const queryString = queryParams.toString();
        if (queryString) {
          url += `?${queryString}`;
        }

        // Make the API request
        const response = await fetch(url);

        // Parse and return the response
        const data = await response.json();
        return JSON.stringify(data);
      } catch (error) {
        return JSON.stringify({ error: error.message || "An error occurred" });
      }
    }
  },
  {
    name: "getPetById",
    description: "Find pet by ID.",
    argsSchema: z.object({
    petId: z.number().int().describe("petId")
  }),
    func: async (params) => {
      try {
        // Extract path parameters and create URL
        let url = `https://petstore3.swagger.io/api/v3/pet/${params.petId}`;
        
        // Handle query parameters for GET requests
        const queryParams = new URLSearchParams();
        
        
        // Append query string if there are any query parameters
        const queryString = queryParams.toString();
        if (queryString) {
          url += `?${queryString}`;
        }

        // Make the API request
        const response = await fetch(url);

        // Parse and return the response
        const data = await response.json();
        return JSON.stringify(data);
      } catch (error) {
        return JSON.stringify({ error: error.message || "An error occurred" });
      }
    }
  },
  {
    name: "updatePetWithForm",
    description: "Updates a pet in the store with form data.",
    argsSchema: z.object({
    petId: z.number().int().describe("petId"),
    name: z.string().describe("name"),
    status: z.string().describe("status")
  }),
    func: async (params) => {
      try {
        // Extract path parameters and create URL
        let url = `https://petstore3.swagger.io/api/v3/pet/${params.petId}`;
        
        // Handle query parameters for GET requests
        

        // Make the API request
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(params),
        });

        // Parse and return the response
        const data = await response.json();
        return JSON.stringify(data);
      } catch (error) {
        return JSON.stringify({ error: error.message || "An error occurred" });
      }
    }
  },
  {
    name: "deletePet",
    description: "Deletes a pet.",
    argsSchema: z.object({
    api_key: z.string().describe("api_key"),
    petId: z.number().int().describe("petId")
  }),
    func: async (params) => {
      try {
        // Extract path parameters and create URL
        let url = `https://petstore3.swagger.io/api/v3/pet/${params.petId}`;
        
        // Handle query parameters for GET requests
        

        // Make the API request
        const response = await fetch(url, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          
        });

        // Parse and return the response
        const data = await response.json();
        return JSON.stringify(data);
      } catch (error) {
        return JSON.stringify({ error: error.message || "An error occurred" });
      }
    }
  },
  {
    name: "uploadFile",
    description: "Uploads an image.",
    argsSchema: z.object({
    petId: z.number().int().describe("petId"),
    additionalMetadata: z.string().describe("additionalMetadata")
  }),
    func: async (params) => {
      try {
        // Extract path parameters and create URL
        let url = `https://petstore3.swagger.io/api/v3/pet/${params.petId}/uploadImage`;
        
        // Handle query parameters for GET requests
        

        // Make the API request
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(params),
        });

        // Parse and return the response
        const data = await response.json();
        return JSON.stringify(data);
      } catch (error) {
        return JSON.stringify({ error: error.message || "An error occurred" });
      }
    }
  },
  {
    name: "getInventory",
    description: "Returns pet inventories by status.",
    argsSchema: z.object({}),
    func: async (_) => {
      try {
        // Extract path parameters and create URL
        let url = `https://petstore3.swagger.io/api/v3/store/inventory`;
        
        // Handle query parameters for GET requests
        

        // Make the API request
        const response = await fetch(url);

        // Parse and return the response
        const data = await response.json();
        return JSON.stringify(data);
      } catch (error) {
        return JSON.stringify({ error: error.message || "An error occurred" });
      }
    }
  },
  {
    name: "placeOrder",
    description: "Place an order for a pet.",
    argsSchema: z.object({
    id: z.number().int().describe("id"),
    petId: z.number().int().describe("petId"),
    quantity: z.number().int().describe("quantity"),
    shipDate: z.string().describe("shipDate"),
    status: z.string().describe("status"),
    complete: z.boolean().describe("complete")
  }),
    func: async (params) => {
      try {
        // Extract path parameters and create URL
        let url = `https://petstore3.swagger.io/api/v3/store/order`;
        
        // Handle query parameters for GET requests
        

        // Make the API request
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(params),
        });

        // Parse and return the response
        const data = await response.json();
        return JSON.stringify(data);
      } catch (error) {
        return JSON.stringify({ error: error.message || "An error occurred" });
      }
    }
  },
  {
    name: "getOrderById",
    description: "Find purchase order by ID.",
    argsSchema: z.object({
    orderId: z.number().int().describe("orderId")
  }),
    func: async (params) => {
      try {
        // Extract path parameters and create URL
        let url = `https://petstore3.swagger.io/api/v3/store/order/${params.orderId}`;
        
        // Handle query parameters for GET requests
        const queryParams = new URLSearchParams();
        
        
        // Append query string if there are any query parameters
        const queryString = queryParams.toString();
        if (queryString) {
          url += `?${queryString}`;
        }

        // Make the API request
        const response = await fetch(url);

        // Parse and return the response
        const data = await response.json();
        return JSON.stringify(data);
      } catch (error) {
        return JSON.stringify({ error: error.message || "An error occurred" });
      }
    }
  },
  {
    name: "deleteOrder",
    description: "Delete purchase order by identifier.",
    argsSchema: z.object({
    orderId: z.number().int().describe("orderId")
  }),
    func: async (params) => {
      try {
        // Extract path parameters and create URL
        let url = `https://petstore3.swagger.io/api/v3/store/order/${params.orderId}`;
        
        // Handle query parameters for GET requests
        

        // Make the API request
        const response = await fetch(url, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          
        });

        // Parse and return the response
        const data = await response.json();
        return JSON.stringify(data);
      } catch (error) {
        return JSON.stringify({ error: error.message || "An error occurred" });
      }
    }
  },
  {
    name: "createUser",
    description: "Create user.",
    argsSchema: z.object({
    id: z.number().int().describe("id"),
    username: z.string().describe("username"),
    firstName: z.string().describe("firstName"),
    lastName: z.string().describe("lastName"),
    email: z.string().describe("email"),
    password: z.string().describe("password"),
    phone: z.string().describe("phone"),
    userStatus: z.number().int().describe("userStatus")
  }),
    func: async (params) => {
      try {
        // Extract path parameters and create URL
        let url = `https://petstore3.swagger.io/api/v3/user`;
        
        // Handle query parameters for GET requests
        

        // Make the API request
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(params),
        });

        // Parse and return the response
        const data = await response.json();
        return JSON.stringify(data);
      } catch (error) {
        return JSON.stringify({ error: error.message || "An error occurred" });
      }
    }
  },
  {
    name: "createUsersWithListInput",
    description: "Creates list of users with given input array.",
    argsSchema: z.object({}),
    func: async (_) => {
      try {
        // Extract path parameters and create URL
        let url = `https://petstore3.swagger.io/api/v3/user/createWithList`;
        
        // Handle query parameters for GET requests
        

        // Make the API request
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        });

        // Parse and return the response
        const data = await response.json();
        return JSON.stringify(data);
      } catch (error) {
        return JSON.stringify({ error: error.message || "An error occurred" });
      }
    }
  },
  {
    name: "loginUser",
    description: "Logs user into the system.",
    argsSchema: z.object({
    username: z.string().describe("username"),
    password: z.string().describe("password")
  }),
    func: async (params) => {
      try {
        // Extract path parameters and create URL
        let url = `https://petstore3.swagger.io/api/v3/user/login`;
        
        // Handle query parameters for GET requests
        const queryParams = new URLSearchParams();
        if (params.username !== undefined) queryParams.append("username", params.username.toString());
        if (params.password !== undefined) queryParams.append("password", params.password.toString());
        
        // Append query string if there are any query parameters
        const queryString = queryParams.toString();
        if (queryString) {
          url += `?${queryString}`;
        }

        // Make the API request
        const response = await fetch(url);

        // Parse and return the response
        const data = await response.json();
        return JSON.stringify(data);
      } catch (error) {
        return JSON.stringify({ error: error.message || "An error occurred" });
      }
    }
  },
  {
    name: "logoutUser",
    description: "Logs out current logged in user session.",
    argsSchema: z.object({}),
    func: async (_) => {
      try {
        // Extract path parameters and create URL
        let url = `https://petstore3.swagger.io/api/v3/user/logout`;
        
        // Handle query parameters for GET requests
        

        // Make the API request
        const response = await fetch(url);

        // Parse and return the response
        const data = await response.json();
        return JSON.stringify(data);
      } catch (error) {
        return JSON.stringify({ error: error.message || "An error occurred" });
      }
    }
  },
  {
    name: "getUserByName",
    description: "Get user by user name.",
    argsSchema: z.object({
    username: z.string().describe("username")
  }),
    func: async (params) => {
      try {
        // Extract path parameters and create URL
        let url = `https://petstore3.swagger.io/api/v3/user/${params.username}`;
        
        // Handle query parameters for GET requests
        const queryParams = new URLSearchParams();
        
        
        // Append query string if there are any query parameters
        const queryString = queryParams.toString();
        if (queryString) {
          url += `?${queryString}`;
        }

        // Make the API request
        const response = await fetch(url);

        // Parse and return the response
        const data = await response.json();
        return JSON.stringify(data);
      } catch (error) {
        return JSON.stringify({ error: error.message || "An error occurred" });
      }
    }
  },
  {
    name: "updateUser",
    description: "Update user resource.",
    argsSchema: z.object({
    username: z.string().describe("username"),
    id: z.number().int().describe("id"),
    firstName: z.string().describe("firstName"),
    lastName: z.string().describe("lastName"),
    email: z.string().describe("email"),
    password: z.string().describe("password"),
    phone: z.string().describe("phone"),
    userStatus: z.number().int().describe("userStatus")
  }),
    func: async (params) => {
      try {
        // Extract path parameters and create URL
        let url = `https://petstore3.swagger.io/api/v3/user/${params.username}`;
        
        // Handle query parameters for GET requests
        

        // Make the API request
        const response = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(params),
        });

        // Parse and return the response
        const data = await response.json();
        return JSON.stringify(data);
      } catch (error) {
        return JSON.stringify({ error: error.message || "An error occurred" });
      }
    }
  },
  {
    name: "deleteUser",
    description: "Delete user resource.",
    argsSchema: z.object({
    username: z.string().describe("username")
  }),
    func: async (params) => {
      try {
        // Extract path parameters and create URL
        let url = `https://petstore3.swagger.io/api/v3/user/${params.username}`;
        
        // Handle query parameters for GET requests
        

        // Make the API request
        const response = await fetch(url, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          
        });

        // Parse and return the response
        const data = await response.json();
        return JSON.stringify(data);
      } catch (error) {
        return JSON.stringify({ error: error.message || "An error occurred" });
      }
    }
  },
  {
    name: "getState",
    description: "Get the current state of the system",
    argsSchema: z.object({}),
    func: async () => {
      try {
        const response = await fetch(`https://petstore3.swagger.io/api/v3/state`);
        const data = await response.json();
        return JSON.stringify(data);
      } catch (error) {
        return JSON.stringify({ error: error.message || "An error occurred" });
      }
    }
  },
];
