import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { generatePromptResponse } from "../../lib/prompt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { text, isDemoMode, apiKey } = req.body;

    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Text is required" });
    }

    // Check for API key
    if (!apiKey && !process.env.OPENAI_API_KEY) {
      return res.status(400).json({ error: "API key is required in API mode" });
    }

    // Read the prompt template from the public directory
    const promptTemplate = fs.readFileSync(
      path.join(process.cwd(), "public", "prompt.txt"),
      "utf-8"
    );

    // Process with AI
    const result = await generatePromptResponse(text, promptTemplate, apiKey);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error processing prompt:", error);
    return res.status(500).json({
      error: "Error processing prompt",
      details: error instanceof Error ? error.message : String(error),
    });
  }
}
