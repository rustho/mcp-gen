/**
 * Handler for getPetById
 * Info for a specific pet
 * 
 * HTTP Method: GET
 * Path: /pets/{petId}
 */
import { z } from "zod";

// Parameter schema definition
export const paramSchema = {
  petId: z.string().describe("petId")
};

// Implementation of the handler
export async function handler(params: any) {
  // Access to the executor's baseUrl
  const baseUrl = this.baseUrl || "https://api.example.com";
  
  try {
    // Make API request
    const response = await fetch(`${baseUrl}/pets/${params.petId}`);
    
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
   petId: "item-id"
 * };
 * 
 * // Call the handler
 * handler(params).then(result => {
 *   console.log("Result:", result);
 * }).catch(error => {
 *   console.error("Error:", error);
 * });
 */
