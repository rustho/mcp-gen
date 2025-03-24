/**
 * API Executor for Generated MCP
 * Generated from Auto-generated Model Control Protocol from OpenAPI
 * Version: 1.0.0
 */

// API Executor - can be used with any framework or directly
export class ApiExecutor {
  private baseUrl: string;

  constructor(baseUrl: string = 'https://api.example.com') {
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
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
    
    // Using List all pets for state
    try {
      const response = await fetch(`${this.baseUrl}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching state:', error);
      return { error: 'Failed to fetch state' };
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
      if (handlerModule && typeof handlerModule.handler === 'function') {
        // Bind this instance to the handler
        return handlerModule.handler.bind(this);
      }
    } catch (error) {
      // If handler file doesn't exist, use built-in handlers
    }

    // Built-in handlers
    switch (actionName) {
      case 'listPets':
        return async (params: any) => {
          const queryObj = {};
          if (params.limit !== undefined) queryObj['limit'] = params.limit;
          const url = buildUrl(this.baseUrl, `/pets`, queryObj);
          
          const response = await fetch(url);
          return await response.json();
        };

      case 'createPet':
        return async (params: any) => {
          const url = `${this.baseUrl}/pets`;
          const bodyParams = {...params};
          
          
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(bodyParams)
          });
          
          return await response.json();
        };

      case 'getPetById':
        return async (params: any) => {
          const url = `${this.baseUrl}/pets/${params.petId}`;
          
          const response = await fetch(url);
          return await response.json();
        };

      case 'deletePet':
        return async (params: any) => {
          const url = `${this.baseUrl}/pets/${params.petId}`;
          
          const response = await fetch(url, {
            method: 'DELETE'
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
function buildUrl(baseUrl: string, path: string, queryParams: Record<string, any> = {}): string {
  const url = new URL(path, baseUrl);
  
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
//   const api = new ApiExecutor('https://api.example.com');
//   
//   // Get API state
//   const state = await api.getState();
//   console.log('Current state:', state);
//   
//   // Execute an action
//   const result = await api.execute('listPets', {
  "limit": "1"
});
// }
//
// main().catch(console.error);