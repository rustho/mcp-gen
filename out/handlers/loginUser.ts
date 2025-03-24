/**
 * Handler for loginUser
 * Logs user into the system.
 * 
 * HTTP Method: GET
 * Path: /user/login
 */
import { z } from "zod";

// Parameter schema definition
export const paramSchema = {
  username: z.string().describe("username"),
  password: z.string().describe("password")
};

// Implementation of the handler
export async function handler(params: any) {
  // Access to the executor's baseUrl
  const baseUrl = this.baseUrl || "https://petstore3.swagger.io/api/v3";
  
  try {
    // Build query string from parameters
    const queryString = new URLSearchParams();
    if (params.username !== undefined) queryString.append("username", String(params.username));
    if (params.password !== undefined) queryString.append("password", String(params.password));
    
    // Make API request
    const response = await fetch(`${baseUrl}/user/login${queryString.toString() ? `?${queryString.toString()}` : ''}`);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error executing loginUser:", error);
    throw error;
  }
}

/**
 * Example of how to use this handler:
 * 
 * import { handler } from "./handlers/loginUser";
 * 
 * // Create params object with all required fields
 * const params = {
   username: "example-username",
   password: "example-password"
 * };
 * 
 * // Call the handler
 * handler(params).then(result => {
 *   console.log("Result:", result);
 * }).catch(error => {
 *   console.error("Error:", error);
 * });
 */
