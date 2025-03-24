/**
 * Handler for findPetsByTags
 * Finds Pets by tags.
 * 
 * HTTP Method: GET
 * Path: /pet/findByTags
 */
import { z } from "zod";

// Parameter schema definition
export const paramSchema = {
  tags: z.array(z.any()).describe("tags")
};

// Implementation of the handler
export async function handler(params: any) {
  // Access to the executor's baseUrl
  const baseUrl = this.baseUrl || "https://petstore3.swagger.io/api/v3";
  
  try {
    // Build query string from parameters
    const queryString = new URLSearchParams();
    if (params.tags !== undefined) queryString.append("tags", String(params.tags));
    
    // Make API request
    const response = await fetch(`${baseUrl}/pet/findByTags${queryString.toString() ? `?${queryString.toString()}` : ''}`);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error executing findPetsByTags:", error);
    throw error;
  }
}

/**
 * Example of how to use this handler:
 * 
 * import { handler } from "./handlers/findPetsByTags";
 * 
 * // Create params object with all required fields
 * const params = {
   tags: []
 * };
 * 
 * // Call the handler
 * handler(params).then(result => {
 *   console.log("Result:", result);
 * }).catch(error => {
 *   console.error("Error:", error);
 * });
 */
