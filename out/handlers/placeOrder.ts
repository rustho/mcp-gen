/**
 * Handler for placeOrder
 * Place an order for a pet.
 * 
 * HTTP Method: POST
 * Path: /store/order
 */
import { z } from "zod";

// Parameter schema definition
export const paramSchema = {
  id: z.number().describe("id"),
  petId: z.number().describe("petId"),
  quantity: z.number().describe("quantity"),
  shipDate: z.string().describe("shipDate"),
  status: z.string().describe("status"),
  complete: z.boolean().describe("complete")
};

// Implementation of the handler
export async function handler(params: any) {
  // Access to the executor's baseUrl
  const baseUrl = this.baseUrl || "https://petstore3.swagger.io/api/v3";
  
  try {
    // Remove path parameters from the body
    const bodyParams = {...params};
    
    
    // Make API request
    const response = await fetch(`${baseUrl}/store/order`, {
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
    console.error("Error executing placeOrder:", error);
    throw error;
  }
}

/**
 * Example of how to use this handler:
 * 
 * import { handler } from "./handlers/placeOrder";
 * 
 * // Create params object with all required fields
 * const params = {
   id: 42,
   petId: 42,
   quantity: 42,
   shipDate: "example-shipDate",
   status: "example-status",
   complete: true
 * };
 * 
 * // Call the handler
 * handler(params).then(result => {
 *   console.log("Result:", result);
 * }).catch(error => {
 *   console.error("Error:", error);
 * });
 */
