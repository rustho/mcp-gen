/**
 * Handler for uploadFile
 * Uploads an image.
 * 
 * HTTP Method: POST
 * Path: /pet/{petId}/uploadImage
 */
import { z } from "zod";

// Parameter schema definition
export const paramSchema = {
  petId: z.number().describe("petId"),
  additionalMetadata: z.string().describe("additionalMetadata")
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
    const response = await fetch(`${baseUrl}/pet/${params.petId}/uploadImage`, {
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
    console.error("Error executing uploadFile:", error);
    throw error;
  }
}

/**
 * Example of how to use this handler:
 * 
 * import { handler } from "./handlers/uploadFile";
 * 
 * // Create params object with all required fields
 * const params = {
   petId: "1",
   additionalMetadata: "example-additionalMetadata"
 * };
 * 
 * // Call the handler
 * handler(params).then(result => {
 *   console.log("Result:", result);
 * }).catch(error => {
 *   console.error("Error:", error);
 * });
 */
