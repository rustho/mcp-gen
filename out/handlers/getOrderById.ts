/**
 * Handler for getOrderById
 * Find purchase order by ID.
 * 
 * HTTP Method: GET
 * Path: /store/order/{orderId}
 */
import { z } from "zod";

// Parameter schema definition
export const paramSchema = {
  orderId: z.number().describe("orderId")
};

// Implementation of the handler
export async function handler(params: any) {
  // Access to the executor's baseUrl
  const baseUrl = this.baseUrl || "https://petstore3.swagger.io/api/v3";
  
  try {
    // Make API request
    const response = await fetch(`${baseUrl}/store/order/${params.orderId}`);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error executing getOrderById:", error);
    throw error;
  }
}

/**
 * Example of how to use this handler:
 * 
 * import { handler } from "./handlers/getOrderById";
 * 
 * // Create params object with all required fields
 * const params = {
   orderId: "1"
 * };
 * 
 * // Call the handler
 * handler(params).then(result => {
 *   console.log("Result:", result);
 * }).catch(error => {
 *   console.error("Error:", error);
 * });
 */
