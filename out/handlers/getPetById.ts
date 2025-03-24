/**
 * Handler for getPetById
 * Find pet by ID.
 * 
 * HTTP Method: GET
 * Path: /pet/{petId}
 */
import { z } from "zod";

// Parameter schema definition
export const paramSchema = {
  petId: z.number().describe("petId")
};

// Implementation of the handler
export async function handler(params: any) {
  // Access to the executor's baseUrl
  const baseUrl = this.baseUrl || "https://petstore3.swagger.io/api/v3";
  
  try {
    // Make API request
    const response = await fetch(`${baseUrl}/pet/${params.petId}`);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error executing getPetById:", error);
    throw error;
  }
}

/**
 * Example of how to use this handler:
 * 
 * import { handler } from "./handlers/getPetById";
 * 
 * // Create params object with all required fields
 * const params = {
   petId: "1"
 * };
 * 
 * // Call the handler
 * handler(params).then(result => {
 *   console.log("Result:", result);
 * }).catch(error => {
 *   console.error("Error:", error);
 * });
 */
