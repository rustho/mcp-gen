/**
 * Handler for createUser
 * Create user.
 * 
 * HTTP Method: POST
 * Path: /user
 */
import { z } from "zod";

// Parameter schema definition
export const paramSchema = {
  id: z.number().describe("id"),
  username: z.string().describe("username"),
  firstName: z.string().describe("firstName"),
  lastName: z.string().describe("lastName"),
  email: z.string().describe("email"),
  password: z.string().describe("password"),
  phone: z.string().describe("phone"),
  userStatus: z.number().describe("userStatus")
};

// Implementation of the handler
export async function handler(params: any) {
  // Access to the executor's baseUrl
  const baseUrl = this.baseUrl || "https://petstore3.swagger.io/api/v3";
  
  try {
    // Remove path parameters from the body
    const bodyParams = {...params};
    
    
    // Make API request
    const response = await fetch(`${baseUrl}/user`, {
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
    console.error("Error executing createUser:", error);
    throw error;
  }
}

/**
 * Example of how to use this handler:
 * 
 * import { handler } from "./handlers/createUser";
 * 
 * // Create params object with all required fields
 * const params = {
   id: 42,
   username: "example-username",
   firstName: "example-firstName",
   lastName: "example-lastName",
   email: "example-email",
   password: "example-password",
   phone: "example-phone",
   userStatus: 42
 * };
 * 
 * // Call the handler
 * handler(params).then(result => {
 *   console.log("Result:", result);
 * }).catch(error => {
 *   console.error("Error:", error);
 * });
 */
