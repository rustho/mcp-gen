# API Handlers for Generated MCP

This directory contains individual handler files for each API action defined in the MCP specification.
Each file provides an implementation of a single API endpoint and can be customized as needed.

## How to Use Handlers

Each handler file exports two main components:

1. `paramSchema`: A Zod schema that defines the parameters for the action
2. `handler`: An async function that implements the action

Handlers can be used directly or imported by the executor:

```typescript
// Direct usage
import { handler } from './handlers/actionName';

const result = await handler({ paramName: 'value' });
console.log(result);

// Usage with executor
import { ApiExecutor } from '../executor';

const api = new ApiExecutor('https://api.example.com');
const result = await api.execute('actionName', { paramName: 'value' });
console.log(result);
```

## Customizing Handlers

You can modify any handler file to customize its behavior. For example:

```typescript
// Original handler in listItems.ts
export async function handler(params: any) {
  const baseUrl = this.baseUrl || "https://api.example.com";
  const response = await fetch(`${baseUrl}/items`);
  return await response.json();
}

// Modified handler with additional logic
export async function handler(params: any) {
  const baseUrl = this.baseUrl || "https://api.example.com";
  
  // Add caching
  const cacheKey = `items-${JSON.stringify(params)}`;
  const cached = localStorage.getItem(cacheKey);
  
  if (cached) {
    return JSON.parse(cached);
  }
  
  const response = await fetch(`${baseUrl}/items`);
  const data = await response.json();
  
  // Store in cache
  localStorage.setItem(cacheKey, JSON.stringify(data));
  
  return data;
}
```

## Available Handlers

- `updatePet.ts`: Update an existing pet.
- `addPet.ts`: Add a new pet to the store.
- `findPetsByStatus.ts`: Finds Pets by status.
- `findPetsByTags.ts`: Finds Pets by tags.
- `getPetById.ts`: Find pet by ID.
- `updatePetWithForm.ts`: Updates a pet in the store with form data.
- `deletePet.ts`: Deletes a pet.
- `uploadFile.ts`: Uploads an image.
- `getInventory.ts`: Returns pet inventories by status.
- `placeOrder.ts`: Place an order for a pet.
- `getOrderById.ts`: Find purchase order by ID.
- `deleteOrder.ts`: Delete purchase order by identifier.
- `createUser.ts`: Create user.
- `createUsersWithListInput.ts`: Creates list of users with given input array.
- `loginUser.ts`: Logs user into the system.
- `logoutUser.ts`: Logs out current logged in user session.
- `getUserByName.ts`: Get user by user name.
- `updateUser.ts`: Update user resource.
- `deleteUser.ts`: Delete user resource.

- `getState.ts`: Retrieve the current state of the system

## Adding New Handlers

You can add new handlers by creating new TypeScript files in this directory. The filename should match the action name, and the file should export a `handler` function.

```typescript
// Example new handler: customAction.ts

import { z } from "zod";

export const paramSchema = {
  id: z.string().describe("Item ID"),
  action: z.string().describe("Action to perform")
};

export async function handler(params: any) {
  // Implementation
  const { id, action } = params;
  
  // Do something with the parameters
  return { success: true, id, action };
}
```

The executor will automatically detect and use your custom handlers when they're in this directory.
