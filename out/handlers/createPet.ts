/**
 * Handler for createPet
 * Create a pet
 * 
 * HTTP Method: POST
 * Path: /pets
 */
import { z } from "zod";

// Parameter schema definition
export const paramSchema = {
  id: z.number().describe("id"),
  name: z.string().describe("name"),
  tag: z.string().describe("tag")
};

// Implementation of the handler
export async function handler(params: any) {
  // Access to the executor's baseUrl
  const baseUrl = this.baseUrl || "https://api.example.com";
  
  try {
    // Remove path parameters from the body
    const bodyParams = {...params};
    
    
    // Make API request
    const response = await fetch(`${baseUrl}/pets`, {
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
    console.error("Error executing createPet:", error);
    throw error;
  }
}

/**
 * Example of how to use this handler:
 * 
 * import { handler } from "./handlers/createPet";
 * 
 * // Create params object with all required fields
 * const params = {
   id: 42,
   name: "example-name",
   tag: "example-tag"
 * };
 * 
 * // Call the handler
 * handler(params).then(result => {
 *   console.log("Result:", result);
 * }).catch(error => {
 *   console.error("Error:", error);
 * });
 */
