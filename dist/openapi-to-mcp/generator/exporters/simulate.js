"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.simulateMcp = simulateMcp;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
/**
 * Simulate an LLM agent using the MCP specification
 */
async function simulateMcp(mcpJson, prompt, apiBaseUrl, options = {}) {
    console.log(`\n🤖 Simulating LLM agent with prompt: "${prompt}"`);
    // Determine which LLM provider to use (default to OpenAI)
    const provider = options.provider || "openai";
    // Check for required API key
    let apiKey = "";
    if (provider === "openai") {
        apiKey = process.env.OPENAI_API_KEY || "";
        if (!apiKey) {
            console.error("❌ Error: OPENAI_API_KEY environment variable is required for simulation");
            console.log("🔑 Set it with: export OPENAI_API_KEY=your_key_here");
            process.exit(1);
        }
    }
    else if (provider === "claude") {
        apiKey = process.env.CLAUDE_API_KEY || "";
        if (!apiKey) {
            console.error("❌ Error: CLAUDE_API_KEY environment variable is required for Claude simulation");
            console.log("🔑 Set it with: export CLAUDE_API_KEY=your_key_here");
            process.exit(1);
        }
    }
    try {
        // Generate a temporary executor for the simulation
        const { generateExecutor } = await Promise.resolve().then(() => __importStar(require("./generateExecutor")));
        const { generateHandlers } = await Promise.resolve().then(() => __importStar(require("./generateHandlers")));
        // Create temporary directory for generated files
        const tempDir = path_1.default.join(process.cwd(), "temp_simulation");
        if (!fs_1.default.existsSync(tempDir)) {
            fs_1.default.mkdirSync(tempDir, { recursive: true });
        }
        // Generate executor and handlers
        console.log(`📂 Generating temporary executor and handlers for simulation`);
        await generateExecutor(mcpJson, tempDir, apiBaseUrl);
        await generateHandlers(mcpJson, tempDir, apiBaseUrl);
        // Create an executor instance - we'll implement this directly
        // since we can't easily import the generated file
        const executor = createExecutorInstance(mcpJson, apiBaseUrl);
        // Create system prompt from MCP spec
        const systemPrompt = generateSystemPrompt(mcpJson);
        // Create function definitions for the LLM
        const functions = generateFunctionDefinitions(mcpJson);
        console.log("\n📡 Sending request to AI model...");
        // Send request to appropriate provider
        let result;
        if (provider === "openai") {
            result = await callOpenAI(systemPrompt, prompt, functions, apiKey, executor, mcpJson);
        }
        else if (provider === "claude") {
            result = await callClaude(systemPrompt, prompt, functions, apiKey, executor, mcpJson);
        }
        else {
            throw new Error(`Unknown provider: ${provider}`);
        }
        // Clean up temporary files
        // Uncomment if you want to delete the temp files after simulation
        // fs.rmSync(tempDir, { recursive: true, force: true });
        return result;
    }
    catch (error) {
        console.error(`❌ Simulation error: ${error.message}`);
        return { error: error.message };
    }
}
/**
 * Create a simple executor instance for simulation without requiring imports
 */
function createExecutorInstance(mcpJson, apiBaseUrl) {
    return {
        baseUrl: apiBaseUrl,
        async execute(actionName, params = {}) {
            // Get API details for this action
            const action = mcpJson.actions?.find((a) => a.action === actionName);
            if (!action) {
                if (actionName === "getState") {
                    return this.getState();
                }
                throw new Error(`Unknown action: ${actionName}`);
            }
            console.log(`⚡ Executing action: ${actionName} (${action.method} ${action.path})`);
            // Extract path parameters
            const pathParams = (action.path.match(/{([^}]+)}/g) || []).map((param) => param.substring(1, param.length - 1));
            // Get query parameters (params that aren't in the path)
            const queryParams = action.params
                ? Object.keys(action.params).filter((param) => !pathParams.includes(param))
                : [];
            // Format the path with values for path parameters
            let formattedPath = action.path;
            for (const param of pathParams) {
                formattedPath = formattedPath.replace(`{${param}}`, params[param] || "");
            }
            // Implement simple API call based on method
            const baseUrl = this.baseUrl.endsWith("/")
                ? this.baseUrl.slice(0, -1)
                : this.baseUrl;
            const fullPath = `${baseUrl}${formattedPath.startsWith("/") ? formattedPath : `/${formattedPath}`}`;
            // For simulation, we'll just return the expected format rather than making real API calls
            // In a real implementation, these would connect to the actual API
            return {
                success: true,
                action: actionName,
                params,
                message: `Simulated ${action.method} request to ${fullPath}`,
                // Include some dummy data based on the action name
                data: getDummyResponseData(actionName, params),
            };
        },
        async getState() {
            if (!mcpJson.stateSchema) {
                return { message: "No state schema defined" };
            }
            // For simulation, return example data from the state schema if available
            if (mcpJson.stateSchema.example) {
                return mcpJson.stateSchema.example;
            }
            // Otherwise construct a sample response from the properties
            const result = {};
            for (const [key, value] of Object.entries(mcpJson.stateSchema.properties || {})) {
                result[key] = getSampleValueForProperty(value);
            }
            return result;
        },
    };
}
/**
 * Generate a dummy response based on the action name
 */
function getDummyResponseData(actionName, params) {
    // Common pattern: if action has "list" at start, return an array
    if (actionName.toLowerCase().startsWith("list")) {
        return [
            { id: 1, name: "Sample Item 1", ...params },
            { id: 2, name: "Sample Item 2", ...params },
            { id: 3, name: "Sample Item 3", ...params },
        ];
    }
    // If it has "get" at start, return a single item
    if (actionName.toLowerCase().startsWith("get")) {
        return {
            id: params.id || 1,
            name: `Sample Item ${params.id || 1}`,
            description: "This is a sample item description for simulation",
            ...params,
        };
    }
    // For creation actions
    if (actionName.toLowerCase().startsWith("create") ||
        actionName.toLowerCase().startsWith("add")) {
        return {
            id: Math.floor(Math.random() * 1000) + 1,
            created: true,
            timestamp: new Date().toISOString(),
            ...params,
        };
    }
    // For update actions
    if (actionName.toLowerCase().startsWith("update") ||
        actionName.toLowerCase().includes("edit")) {
        return {
            id: params.id || 1,
            updated: true,
            timestamp: new Date().toISOString(),
            ...params,
        };
    }
    // For delete actions
    if (actionName.toLowerCase().startsWith("delete") ||
        actionName.toLowerCase().startsWith("remove")) {
        return {
            id: params.id || 1,
            deleted: true,
            timestamp: new Date().toISOString(),
        };
    }
    // Default response
    return {
        success: true,
        timestamp: new Date().toISOString(),
        ...params,
    };
}
/**
 * Generate a sample value for a property in the state schema
 */
function getSampleValueForProperty(property) {
    if (!property || typeof property !== "object") {
        return "sample value";
    }
    // Handle different types
    switch (property.type?.toLowerCase()) {
        case "string":
            return "sample string";
        case "number":
        case "integer":
            return 42;
        case "boolean":
            return true;
        case "array":
            if (property.items) {
                return [getSampleValueForProperty(property.items)];
            }
            return [];
        case "object":
            if (property.properties) {
                const result = {};
                for (const [key, value] of Object.entries(property.properties)) {
                    result[key] = getSampleValueForProperty(value);
                }
                return result;
            }
            return {};
        default:
            return "sample value";
    }
}
/**
 * Generate a system prompt from the MCP specification
 */
function generateSystemPrompt(mcpJson) {
    return `You are an AI assistant that can interact with the ${mcpJson.name} API.
${mcpJson.description || ""}

You have access to the following actions:
${mcpJson.actions
        ?.map((action) => `- ${action.action}: ${action.description || `${action.method} ${action.path}`}`)
        .join("\n")}

${mcpJson.stateSchema
        ? `
You can also get the current state of the system using getState().
The state has the following structure:
${JSON.stringify(mcpJson.stateSchema.properties, null, 2)}
`
        : ""}

Please help the user by calling the appropriate functions based on their request.
Always respond in a helpful, concise manner.`;
}
/**
 * Generate function definitions for the LLM
 */
function generateFunctionDefinitions(mcpJson) {
    const functions = mcpJson.actions?.map((action) => {
        const parameters = {
            type: "object",
            properties: {},
            required: [],
        };
        // Add parameters
        if (action.params) {
            for (const [paramName, paramType] of Object.entries(action.params)) {
                parameters.properties[paramName] = {
                    type: mapOpenApiTypeToJsonSchema(paramType),
                    description: paramName,
                };
                parameters.required.push(paramName);
            }
        }
        return {
            name: action.action,
            description: action.description || `${action.method} ${action.path}`,
            parameters,
        };
    }) || [];
    // Add getState function if state schema exists
    if (mcpJson.stateSchema) {
        functions.push({
            name: "getState",
            description: "Get the current state of the system",
            parameters: {
                type: "object",
                properties: {},
                required: [],
            },
        });
    }
    return functions;
}
/**
 * Map OpenAPI/MCP types to JSON Schema types
 */
function mapOpenApiTypeToJsonSchema(type) {
    switch (type.toLowerCase()) {
        case "integer":
            return "integer";
        case "number":
            return "number";
        case "boolean":
            return "boolean";
        case "array":
            return "array";
        case "object":
            return "object";
        default:
            return "string";
    }
}
/**
 * Call OpenAI API with function calling
 */
async function callOpenAI(systemPrompt, userPrompt, functions, apiKey, executor, mcpJson) {
    try {
        console.log("⚙️ Checking for OpenAI SDK...");
        try {
            // This is just to check if the package is installed
            require.resolve("openai");
        }
        catch (error) {
            console.error("❌ OpenAI SDK not found. Please install it with:");
            console.error("  npm install openai");
            console.error("Since this is an optional dependency, you need to install it manually.");
            process.exit(1);
        }
        // Only import after checking
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const OpenAI = require("openai").default;
        console.log("✅ OpenAI SDK found, initializing...");
        const openai = new OpenAI({
            apiKey,
        });
        console.log("📡 Sending request to OpenAI...");
        const completion = await openai.chat.completions.create({
            model: "gpt-4-turbo",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
            tools: functions.map((fn) => ({
                type: "function",
                function: fn,
            })),
            tool_choice: "auto",
        });
        // Process the response
        const message = completion.choices[0].message;
        // Handle function calls if present
        if (message.tool_calls && message.tool_calls.length > 0) {
            console.log(`\n🔧 AI wants to call function: ${message.tool_calls[0].function.name}`);
            // Execute the function
            const functionName = message.tool_calls[0].function.name;
            const functionArgs = JSON.parse(message.tool_calls[0].function.arguments);
            console.log(`📤 With arguments: ${JSON.stringify(functionArgs)}`);
            // Call the API through our executor
            const result = await executor.execute(functionName, functionArgs);
            console.log(`📥 Result: ${JSON.stringify(result).substring(0, 200)}${JSON.stringify(result).length > 200 ? "..." : ""}`);
            // Get final response from AI with the function result
            const finalResponse = await openai.chat.completions.create({
                model: "gpt-4-turbo",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt },
                    message,
                    {
                        role: "tool",
                        tool_call_id: message.tool_calls[0].id,
                        content: JSON.stringify(result),
                    },
                ],
            });
            return {
                action: functionName,
                arguments: functionArgs,
                result,
                response: finalResponse.choices[0].message.content,
            };
        }
        // Return text response if no function calls
        return {
            response: message.content,
        };
    }
    catch (error) {
        console.error("Error calling OpenAI:", error.message);
        throw error;
    }
}
/**
 * Call Claude API with function calling (tool use)
 */
async function callClaude(systemPrompt, userPrompt, functions, apiKey, executor, mcpJson) {
    try {
        console.log("⚙️ Checking for Anthropic SDK...");
        try {
            // This is just to check if the package is installed
            require.resolve("@anthropic-ai/sdk");
        }
        catch (error) {
            console.error("❌ Anthropic SDK not found. Please install it with:");
            console.error("  npm install @anthropic-ai/sdk");
            console.error("Since this is an optional dependency, you need to install it manually.");
            process.exit(1);
        }
        // Only import after checking
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const Anthropic = require("@anthropic-ai/sdk").default;
        console.log("✅ Anthropic SDK found, initializing...");
        const anthropic = new Anthropic({
            apiKey,
        });
        console.log("📡 Sending request to Claude...");
        // Convert our function definitions to Claude's tool format
        const tools = functions.map((fn) => ({
            name: fn.name,
            description: fn.description,
            input_schema: {
                type: "object",
                properties: fn.parameters.properties,
                required: fn.parameters.required,
            },
        }));
        // Call Claude with tools
        const message = await anthropic.messages.create({
            model: "claude-3-opus-20240229",
            system: systemPrompt,
            messages: [{ role: "user", content: userPrompt }],
            tools,
        });
        // Handle tool use if present
        if (message.content.find((c) => c.type === "tool_use")) {
            const toolUse = message.content.find((c) => c.type === "tool_use");
            if (toolUse) {
                console.log(`\n🔧 Claude wants to call function: ${toolUse.name}`);
                // Extract function details
                const functionName = toolUse.name;
                const functionArgs = toolUse.input;
                console.log(`📤 With arguments: ${JSON.stringify(functionArgs)}`);
                // Call the API through our executor
                const result = await executor.execute(functionName, functionArgs);
                console.log(`📥 Result: ${JSON.stringify(result).substring(0, 200)}${JSON.stringify(result).length > 200 ? "..." : ""}`);
                // Get final response from Claude with the function result
                const finalResponse = await anthropic.messages.create({
                    model: "claude-3-opus-20240229",
                    system: systemPrompt,
                    messages: [
                        { role: "user", content: userPrompt },
                        {
                            role: "assistant",
                            content: [toolUse],
                        },
                        {
                            role: "user",
                            content: [
                                {
                                    type: "tool_result",
                                    tool_use_id: toolUse.id,
                                    content: JSON.stringify(result),
                                },
                            ],
                        },
                    ],
                });
                return {
                    action: functionName,
                    arguments: functionArgs,
                    result,
                    response: finalResponse.content
                        .filter((c) => c.type === "text")
                        .map((c) => c.text)
                        .join("\n"),
                };
            }
        }
        // Return text response if no tool use
        return {
            response: message.content
                .filter((c) => c.type === "text")
                .map((c) => c.text)
                .join("\n"),
        };
    }
    catch (error) {
        console.error("Error calling Claude:", error.message);
        throw error;
    }
}
//# sourceMappingURL=simulate.js.map