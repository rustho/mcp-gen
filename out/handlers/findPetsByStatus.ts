/**
 * Handler for findPetsByStatus
 * Finds Pets by status.
 * 
 * HTTP Method: GET
 * Path: /pet/findByStatus
 */
import { z } from "zod";

// Parameter schema definition
export const paramSchema = {
  status: z.string().describe("status")
};

// Implementation of the handler
export async function handler(params: any) {
  // Access to the executor's baseUrl
  const baseUrl = this.baseUrl || "https://petstore3.swagger.io/api/v3";
  
  try {
    // Build query string from parameters
    const queryString = new URLSearchParams();
    if (params.status !== undefined) queryString.append("status", String(params.status));
    
    // Make API request
    const response = await fetch(`${baseUrl}/pet/findByStatus${queryString.toString() ? `?${queryString.toString()}` : ''}`);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error executing findPetsByStatus:", error);
    throw error;
  }
}

/**
 * Example of how to use this handler:
 * 
 * import { handler } from "./handlers/findPetsByStatus";
 * 
 * // Create params object with all required fields
 * const params = {
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
