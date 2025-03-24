"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const prompt_1 = require("../../lib/prompt");
async function handler(req, res) {
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
        const promptTemplate = fs_1.default.readFileSync(path_1.default.join(process.cwd(), "public", "prompt.txt"), "utf-8");
        // Process with AI
        const result = await (0, prompt_1.generatePromptResponse)(text, promptTemplate, apiKey);
        return res.status(200).json(result);
    }
    catch (error) {
        console.error("Error processing prompt:", error);
        return res.status(500).json({
            error: "Error processing prompt",
            details: error instanceof Error ? error.message : String(error),
        });
    }
}
//# sourceMappingURL=prompt.js.map