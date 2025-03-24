import type { NextApiRequest, NextApiResponse } from "next";
import { ApiExecutor } from "../../lib/executor";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { text } = req.body;

    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Action and params are required" });
    }

    // Parse the JSON input
    let actionData;
    try {
      actionData = JSON.parse(text);
    } catch (error) {
      return res.status(400).json({ error: "Invalid JSON format" });
    }

    const { action, params } = actionData;

    if (!action || typeof action !== "string") {
      return res.status(400).json({ error: "Action name is required" });
    }

    // Execute the action
    const executor = new ApiExecutor();
    const result = await executor.execute(action, params || {});

    // Format as MCP tool call response
    const mcpResponse = {
      content: [
        {
          type: "tool_result",
          tool_name: action,
          tool_call_id: `call_${Date.now()}`,
          result: result,
        },
      ],
    };

    return res.status(200).json(mcpResponse);
  } catch (error) {
    console.error("Error processing MCP call:", error);
    return res.status(500).json({
      error: "Error processing MCP call",
      details: error instanceof Error ? error.message : String(error),
    });
  }
}
