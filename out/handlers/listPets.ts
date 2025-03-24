/**
 * Handler for listPets
 * List all pets
 * 
 * HTTP Method: GET
 * Path: /pets
 */
import { z } from "zod";

// Parameter schema definition
export const paramSchema = {
  limit: z.number().describe("limit")
};

// Implementation of the handler
export async function handler(params: any) {
  // Access to the executor's baseUrl
  const baseUrl = this.baseUrl || "https://api.example.com";
  
  try {
    // Build query string from parameters
    const queryString = new URLSearchParams();
    if (params.limit !== undefined) queryString.append("limit", String(params.limit));
    
    // Make API request
    const response = await fetch(`${baseUrl}/pets${queryString.toString() ? `?${queryString.toString()}` : ''}`);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error executing listPets:", error);
    throw error;
  }
}

/**
 * Example of how to use this handler:
 * 
 * import { handler } from "./handlers/listPets";
 * 
 * // Create params object with all required fields
 * const params = {
   limit: 42
 * };
 * 
 * // Call the handler
 * handler(params).then(result => {
 *   console.log("Result:", result);
 * }).catch(error => {
 *   console.error("Error:", error);
 * });
 */
