/**
 * Handler for updatePetWithForm
 * Updates a pet in the store with form data.
 * 
 * HTTP Method: POST
 * Path: /pet/{petId}
 */
import { z } from "zod";

// Parameter schema definition
export const paramSchema = {
  petId: z.number().describe("petId"),
  name: z.string().describe("name"),
  status: z.string().describe("status")
};

// Implementation of the handler
export async function handler(params: any) {
  // Access to the executor's baseUrl
  const baseUrl = this.baseUrl || "https://petstore3.swagger.io/api/v3";
  
  try {
    // Remove path parameters from the body
    const bodyParams = {...params};
    delete bodyParams.petId;
    
    // Make API request
    const response = await fetch(`${baseUrl}/pet/${params.petId}`, {
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
    console.error("Error executing updatePetWithForm:", error);
    throw error;
  }
}

/**
 * Example of how to use this handler:
 * 
 * import { handler } from "./handlers/updatePetWithForm";
 * 
 * // Create params object with all required fields
 * const params = {
   petId: "1",
   name: "example-name",
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
