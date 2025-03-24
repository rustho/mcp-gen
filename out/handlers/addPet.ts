/**
 * Handler for addPet
 * Add a new pet to the store.
 * 
 * HTTP Method: POST
 * Path: /pet
 */
import { z } from "zod";

// Parameter schema definition
export const paramSchema = {
  id: z.number().describe("id"),
  name: z.string().describe("name"),
  category: z.record(z.any()).describe("category"),
  photoUrls: z.array(z.any()).describe("photoUrls"),
  tags: z.array(z.any()).describe("tags"),
  status: z.string().describe("status")
};

// Implementation of the handler
export async function handler(params: any) {
  // Access to the executor's baseUrl
  const baseUrl = this.baseUrl || "https://petstore3.swagger.io/api/v3";
  
  try {
    // Remove path parameters from the body
    const bodyParams = {...params};
    
    
    // Make API request
    const response = await fetch(`${baseUrl}/pet`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(bodyParams)
    });
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error executing addPet:", error);
    throw error;
  }
}

/**
 * Example of how to use this handler:
 * 
 * import { handler } from "./handlers/addPet";
 * 
 * // Create params object with all required fields
 * const params = {
   id: 42,
   name: "example-name",
   category: {},
   photoUrls: [],
   tags: [],
   status: "example-status"
 * };
 * 
 * // Call the handler
 * handler(params).then(result => {
 *   console.log("Result:", result);
 * }).catch(error => {
 *   console.error("Error:", error);
 * });
 */
