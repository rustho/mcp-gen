"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const executor_1 = require("../../lib/executor");
async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }
    try {
        const { text } = req.body;
        console.log("text", text);
        if (!text || typeof text !== "string") {
            return res.status(400).json({ error: "JSON MCP command is required" });
        }
        // Parse the JSON input
        let mcpCommand;
        try {
            mcpCommand = JSON.parse(text);
        }
        catch (error) {
            return res.status(400).json({ error: "Invalid JSON format" });
        }
        // Execute the MCP command
        const executor = new executor_1.ApiExecutor();
        console.log("mcpCommand", mcpCommand);
        const result = await executor.execute(mcpCommand.action, mcpCommand.params);
        console.log("result", result);
        return res.status(200).json(result);
    }
    catch (error) {
        console.error("Error executing MCP command:", error);
        return res.status(500).json({
            error: "Error executing MCP command",
            details: error instanceof Error ? error.message : String(error),
        });
    }
}
//# sourceMappingURL=execute.js.map