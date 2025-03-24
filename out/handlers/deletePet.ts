/**
 * Handler for deletePet
 * Deletes a pet.
 * 
 * HTTP Method: DELETE
 * Path: /pet/{petId}
 */
import { z } from "zod";

// Parameter schema definition
export const paramSchema = {
  api_key: z.string().describe("api_key"),
  petId: z.number().describe("petId")
};

// Implementation of the handler
export async function handler(params: any) {
  // Access to the executor's baseUrl
  const baseUrl = this.baseUrl || "https://petstore3.swagger.io/api/v3";
  
  try {
    // Make API request
    const response = await fetch(`${baseUrl}/pet/${params.petId}`, {
      method: "DELETE"
    });
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error executing deletePet:", error);
    throw error;
  }
}

/**
 * Example of how to use this handler:
 * 
 * import { handler } from "./handlers/deletePet";
 * 
 * // Create params object with all required fields
 * const params = {
   api_key: "example-api_key",
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
