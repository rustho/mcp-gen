/**
 * Handler for getUserByName
 * Get user by user name.
 * 
 * HTTP Method: GET
 * Path: /user/{username}
 */
import { z } from "zod";

// Parameter schema definition
export const paramSchema = {
  username: z.string().describe("username")
};

// Implementation of the handler
export async function handler(params: any) {
  // Access to the executor's baseUrl
  const baseUrl = this.baseUrl || "https://petstore3.swagger.io/api/v3";
  
  try {
    // Make API request
    const response = await fetch(`${baseUrl}/user/${params.username}`);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error executing getUserByName:", error);
    throw error;
  }
}

/**
 * Example of how to use this handler:
 * 
 * import { handler } from "./handlers/getUserByName";
 * 
 * // Create params object with all required fields
 * const params = {
   username: "item-id"
 * };
 * 
 * // Call the handler
 * handler(params).then(result => {
 *   console.log("Result:", result);
 * }).catch(error => {
 *   console.error("Error:", error);
 * });
 */
