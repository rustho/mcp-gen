import { Tool } from "langchain/tools";
import { tools as allTools } from "./langchain-tools";

/**
 * Helper to load specific tools from the Generated MCP API
 * 
 * @param toolNames Names of the tools to load, or "all" to load all tools
 * @returns Array of LangChain Tool instances
 */
export function loadTools(toolNames: string[] | "all" = "all"): Tool[] {
  if (toolNames === "all") {
    return allTools;
  }
  
  return allTools.filter(tool => toolNames.includes(tool.name));
}

/**
 * Available tool names:
 */
export const availableTools = [
  "listPets",
  "createPet",
  "getPetById",
  "deletePet",
  "getState",
];
