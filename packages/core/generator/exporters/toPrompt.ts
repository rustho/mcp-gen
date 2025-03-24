import { MCPJson } from "../types";

export function exportPrompt(mcp: MCPJson): string {
  const { promptTemplate, actions, stateSchema, groups } = mcp;

  // Group actions by their tags
  const groupedActions = groupActionsByTags(actions);

  // Generate action descriptions
  const actionDescriptions = Object.entries(groupedActions)
    .map(([group, groupActions], index) => {
      const groupTitle = getGroupTitle(group, groups, index + 1);
      const actionList = groupActions
        .map((a) => formatActionDescription(a))
        .join("\n");
      return `${groupTitle}:\n${actionList}`;
    })
    .join("\n\n");

  // Generate state information
  const stateInfo = stateSchema ? formatStateInfo(stateSchema) : "";

  // Generate example responses
  const exampleResponses = generateExampleResponses(actions);

  return `${promptTemplate.prefix}

AVAILABLE ACTIONS:
${actionDescriptions}${stateInfo}

USER REQUEST:
{{USER_TEXT}}

INSTRUCTIONS:
1. Analyze the user's request carefully
2. Identify the most appropriate action from the available actions
3. Extract relevant parameters from the request
4. Format the response as a JSON object with "action" and "params" fields
5. Ensure all required parameters are included
6. Use appropriate data types for parameters

RESPONSE FORMAT:
{
  "action": "actionName",
  "params": {
    "param1": "value1",
    "param2": "value2"
  }
}

Example responses:
${exampleResponses}`.trim();
}

function groupActionsByTags(actions: any[]): Record<string, any[]> {
  const groups: Record<string, any[]> = {};

  actions.forEach((action) => {
    // If action has no tags, put it in a default group
    if (!action.tags || action.tags.length === 0) {
      const defaultGroup = "other";
      if (!groups[defaultGroup]) {
        groups[defaultGroup] = [];
      }
      groups[defaultGroup].push(action);
      return;
    }

    // Group by the first tag
    const group = action.tags[0].toLowerCase();
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(action);
  });

  return groups;
}

function getGroupTitle(
  group: string,
  groups?: Record<string, string>,
  index?: number
): string {
  // If groups configuration exists, use it
  if (groups && groups[group]) {
    return `${index}. ${groups[group]}`;
  }

  // Fallback to generated title if no configuration
  return `${index}. ${
    group.charAt(0).toUpperCase() + group.slice(1)
  } Management`;
}

function formatActionDescription(action: any): string {
  const params = Object.entries(action.params)
    .map(([key, value]: [string, any]) => {
      const description = getParamDescription(key, value);
      return `     Parameters: ${key}${description ? ` (${description})` : ""}`;
    })
    .join("\n");

  return `   - ${action.action} (${action.method} ${action.path}): ${
    action.description || ""
  }\n${params}`;
}

function getParamDescription(key: string, value: any): string {
  // Add descriptions for common parameters
  const descriptions: Record<string, string> = {
    status: "available, pending, sold",
    tags: "array of tag names",
  };
  return descriptions[key] || "";
}

function formatStateInfo(stateSchema: any): string {
  const { type, properties, description } = stateSchema;

  let stateDescription = "The system maintains a state of available data.";
  if (description) {
    stateDescription = description;
  }

  return `\n\nCURRENT SYSTEM STATE:\n${stateDescription}\nExample state:\n${JSON.stringify(
    stateSchema.example,
    null,
    2
  )}`;
}

function generateExampleResponses(actions: any[]): string {
  // Generate examples for different types of operations
  const examples = actions
    .filter((a) => a.example)
    .slice(0, 2)
    .map((action, index) => {
      const example = action.example;
      return `${index + 1}. For "${example.description}":\n${JSON.stringify(
        example.response,
        null,
        2
      )}`;
    })
    .join("\n\n");

  return (
    examples ||
    `1. For "Find all available items":\n${JSON.stringify(
      {
        action: actions[0]?.action || "example",
        params: { status: "available" },
      },
      null,
      2
    )}`
  );
}
