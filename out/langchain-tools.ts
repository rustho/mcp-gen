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
    name: "listPets",
    description: "List all pets",
    argsSchema: z.object({
    limit: z.number().int().describe("limit")
  }),
    func: async (params) => {
      try {
        // Extract path parameters and create URL
        let url = `https://api.example.com/pets`;
        
        // Handle query parameters for GET requests
        const queryParams = new URLSearchParams();
        if (params.limit !== undefined) queryParams.append("limit", params.limit.toString());
        
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
    name: "createPet",
    description: "Create a pet",
    argsSchema: z.object({
    id: z.number().int().describe("id"),
    name: z.string().describe("name"),
    tag: z.string().describe("tag")
  }),
    func: async (params) => {
      try {
        // Extract path parameters and create URL
        let url = `https://api.example.com/pets`;
        
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
    name: "getPetById",
    description: "Info for a specific pet",
    argsSchema: z.object({
    petId: z.string().describe("petId")
  }),
    func: async (params) => {
      try {
        // Extract path parameters and create URL
        let url = `https://api.example.com/pets/${params.petId}`;
        
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
    name: "deletePet",
    description: "Delete a pet",
    argsSchema: z.object({
    petId: z.string().describe("petId")
  }),
    func: async (params) => {
      try {
        // Extract path parameters and create URL
        let url = `https://api.example.com/pets/${params.petId}`;
        
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
        const response = await fetch(`https://api.example.com/state`);
        const data = await response.json();
        return JSON.stringify(data);
      } catch (error) {
        return JSON.stringify({ error: error.message || "An error occurred" });
      }
    }
  },
];
