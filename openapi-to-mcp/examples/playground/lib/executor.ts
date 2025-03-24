/**
 * API Executor for Generated MCP
 * Generated from Auto-generated Model Control Protocol from OpenAPI
 * Version: 1.0.0
 */

// API Executor - can be used with any framework or directly
export class ApiExecutor {
  private baseUrl: string;

  constructor(baseUrl: string = "https://petstore3.swagger.io/api/v3") {
    this.baseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  }

  /**
   * Execute an API action with the given name and parameters
   */
  async execute(actionName: string, params: any = {}) {
    const handler = this.getHandler(actionName);
    if (!handler) {
      throw new Error(`Unknown action: ${actionName}`);
    }

    return handler(params);
  }

  /**
   * Get the current state of the API/system
   */
  async getState() {
    // Using Finds Pets by status. for state
    try {
      const response = await fetch(`${this.baseUrl}`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching state:", error);
      return { error: "Failed to fetch state" };
    }
  }

  /**
   * Get handler for a specific action
   */
  private getHandler(actionName: string) {
    try {
      // Try to dynamically load the handler from handlers directory
      // This allows for user customization of handlers
      const handlerModule = require(`./handlers/${actionName}`);
      if (handlerModule && typeof handlerModule.handler === "function") {
        // Bind this instance to the handler
        return handlerModule.handler.bind(this);
      }
    } catch (error) {
      // If handler file doesn't exist, use built-in handlers
    }

    // Built-in handlers
    switch (actionName) {
      case "updatePet":
        return async (params: any) => {
          const url = `${this.baseUrl}/pet`;
          const bodyParams = { ...params };

          const response = await fetch(url, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(bodyParams),
          });

          return await response.json();
        };

      case "addPet":
        return async (params: any) => {
          const url = `${this.baseUrl}/pet`;
          const bodyParams = { ...params };

          const response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(bodyParams),
          });

          return await response.json();
        };

      case "findPetsByStatus":
        return async (params: any) => {
          const queryObj = {};
          if (params.status !== undefined) queryObj["status"] = params.status;
          const url = buildUrl(this.baseUrl, `/pet/findByStatus`, queryObj);

          const response = await fetch(url);
          return await response.json();
        };

      case "findPetsByTags":
        return async (params: any) => {
          const queryObj = {};
          if (params.tags !== undefined) queryObj["tags"] = params.tags;
          const url = buildUrl(this.baseUrl, `/pet/findByTags`, queryObj);

          const response = await fetch(url);
          return await response.json();
        };

      case "getPetById":
        return async (params: any) => {
          const url = `${this.baseUrl}/pet/${params.petId}`;

          const response = await fetch(url);
          return await response.json();
        };

      case "updatePetWithForm":
        return async (params: any) => {
          const url = `${this.baseUrl}/pet/${params.petId}`;
          const bodyParams = { ...params };
          delete bodyParams.petId;

          const response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(bodyParams),
          });

          return await response.json();
        };

      case "deletePet":
        return async (params: any) => {
          const url = `${this.baseUrl}/pet/${params.petId}`;

          const response = await fetch(url, {
            method: "DELETE",
          });

          return await response.json();
        };

      case "uploadFile":
        return async (params: any) => {
          const url = `${this.baseUrl}/pet/${params.petId}/uploadImage`;
          const bodyParams = { ...params };
          delete bodyParams.petId;

          const response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(bodyParams),
          });

          return await response.json();
        };

      case "getInventory":
        return async (params: any) => {
          const url = `${this.baseUrl}/store/inventory`;

          const response = await fetch(url);
          return await response.json();
        };

      case "placeOrder":
        return async (params: any) => {
          const url = `${this.baseUrl}/store/order`;
          const bodyParams = { ...params };

          const response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(bodyParams),
          });

          return await response.json();
        };

      case "getOrderById":
        return async (params: any) => {
          const url = `${this.baseUrl}/store/order/${params.orderId}`;

          const response = await fetch(url);
          return await response.json();
        };

      case "deleteOrder":
        return async (params: any) => {
          const url = `${this.baseUrl}/store/order/${params.orderId}`;

          const response = await fetch(url, {
            method: "DELETE",
          });

          return await response.json();
        };

      case "createUser":
        return async (params: any) => {
          const url = `${this.baseUrl}/user`;
          const bodyParams = { ...params };

          const response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(bodyParams),
          });

          return await response.json();
        };

      case "createUsersWithListInput":
        return async (params: any) => {
          const url = `${this.baseUrl}/user/createWithList`;
          const bodyParams = { ...params };

          const response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(bodyParams),
          });

          return await response.json();
        };

      case "loginUser":
        return async (params: any) => {
          const queryObj = {};
          if (params.username !== undefined)
            queryObj["username"] = params.username;
          if (params.password !== undefined)
            queryObj["password"] = params.password;
          const url = buildUrl(this.baseUrl, `/user/login`, queryObj);

          const response = await fetch(url);
          return await response.json();
        };

      case "logoutUser":
        return async (params: any) => {
          const url = `${this.baseUrl}/user/logout`;

          const response = await fetch(url);
          return await response.json();
        };

      case "getUserByName":
        return async (params: any) => {
          const url = `${this.baseUrl}/user/${params.username}`;

          const response = await fetch(url);
          return await response.json();
        };

      case "updateUser":
        return async (params: any) => {
          const url = `${this.baseUrl}/user/${params.username}`;
          const bodyParams = { ...params };
          delete bodyParams.username;

          const response = await fetch(url, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(bodyParams),
          });

          return await response.json();
        };

      case "deleteUser":
        return async (params: any) => {
          const url = `${this.baseUrl}/user/${params.username}`;

          const response = await fetch(url, {
            method: "DELETE",
          });

          return await response.json();
        };
      default:
        return null;
    }
  }
}

/**
 * Helper function to build URL with query parameters
 */
function buildUrl(
  baseUrl: string,
  path: string,
  queryParams: Record<string, any> = {}
): string {
  const fullUrl = `${baseUrl}${path}`;
  const url = new URL(fullUrl);

  Object.entries(queryParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, String(value));
    }
  });

  return url.toString();
}

// Example usage:
//
// import { ApiExecutor } from './executor';
//
// async function main() {
//   const api = new ApiExecutor('https://petstore3.swagger.io/api/v3');
//
//   // Get API state
//   const state = await api.getState();
//   console.log('Current state:', state);
//
//   // Execute an action
//   const result = await api.execute('updatePet', {
//   "id": "1",
//   "name": "\"sample-name\"",
//   "category": "{}",
//   "photoUrls": "[]",
//   "tags": "[]",
//   "status": "\"sample-status\""
// });
// }
//
// main().catch(console.error);
