#!/usr/bin/env node
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
const parser_1 = require("./parser");
const extractor_1 = require("./generator/extractor");
const mcpBuilder_1 = require("./generator/mcpBuilder");
const toPrompt_1 = require("./generator/exporters/toPrompt");
const toFunctionSchemas_1 = require("./generator/exporters/toFunctionSchemas");
const toTemplates_1 = require("./generator/exporters/toTemplates");
const generateMcpServer_1 = require("./generator/exporters/generateMcpServer");
const simulate_1 = require("./generator/exporters/simulate");
const toLangChainTools_1 = require("./generator/exporters/toLangChainTools");
const toOpenAIPlugin_1 = require("./generator/exporters/toOpenAIPlugin");
const commander_1 = require("commander");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const program = new commander_1.Command();
program
    .name("openapi-to-mcp")
    .description("Generate MCP files from OpenAPI/Swagger specifications")
    .version("1.0.0");
program
    .argument("<swagger-file>", "Path to OpenAPI/Swagger file")
    .option("-o, --output <dir>", "Output directory", "./out")
    .option("--prompt", "Generate prompt instruction text")
    .option("--functions", "Generate OpenAI function schemas")
    .option("--templates", "Generate JSON action templates")
    .option("--mcp", "Generate MCP JSON file")
    .option("--server", "Generate MCP server TypeScript file (Claude Desktop compatible)")
    .option("--executor", "Generate executor TypeScript file (for direct API execution)")
    .option("--handlers", "Generate handler files for each action")
    .option("--langchain", "Generate LangChain tools and loader files")
    .option("--openai-plugin", "Generate OpenAI plugin manifest in .well-known directory")
    .option("--api-url <url>", "API base URL for server generation", "https://api.example.com")
    .option("--all", "Generate all export formats")
    .option("--state-endpoint <path>", "Specify a specific GET endpoint to use for state schema (e.g. /status)")
    .option("--simulate <prompt>", "Simulate an LLM agent call with the given prompt (requires OpenAI API key)")
    .option("--provider <provider>", "LLM provider for simulation (openai or claude)", "openai")
    .action(async (swaggerFile, options) => {
    try {
        const outputDir = options.output;
        // Create output directory if it doesn't exist
        if (!fs_1.default.existsSync(outputDir)) {
            fs_1.default.mkdirSync(outputDir, { recursive: true });
        }
        console.log(`📥 Parsing Swagger file: ${swaggerFile}`);
        const api = await (0, parser_1.parseSwagger)(swaggerFile);
        console.log("🔍 Extracting actions from API spec");
        const actions = (0, extractor_1.extractActions)(api);
        console.log(`✅ Found ${actions.length} API actions`);
        console.log("🔧 Building MCP JSON structure");
        const mcp = (0, mcpBuilder_1.buildMCPJson)(api, actions, {
            sourceFile: path_1.default.basename(swaggerFile)
        }, options.stateEndpoint);
        if (mcp.stateSchema) {
            console.log(`🔍 Found state schema from ${mcp.stateSchema.description}`);
        }
        // Handle simulation if requested
        if (options.simulate) {
            // Import handlers here dynamically to avoid using them in regular runs
            try {
                const handlersModule = await Promise.resolve().then(() => __importStar(require('./generator/exporters/generateHandlers')));
                const executorModule = await Promise.resolve().then(() => __importStar(require('./generator/exporters/generateExecutor')));
                // Generate handlers and executor
                console.log(`📂 Generating temporary handlers for simulation`);
                handlersModule.generateHandlers(mcp, outputDir, options.apiUrl);
                executorModule.generateExecutor(mcp, outputDir, options.apiUrl);
                // Run simulation
                await (0, simulate_1.simulateMcp)(mcp, options.simulate, options.apiUrl, {
                    provider: options.provider
                });
                // Exit early as we're just simulating
                return;
            }
            catch (error) {
                console.error(`❌ Simulation error: ${error.message}`);
                process.exit(1);
            }
        }
        const generateAll = options.all ||
            !(options.prompt || options.functions || options.templates || options.mcp ||
                options.server || options.executor || options.handlers || options.langchain ||
                options["openai-plugin"]);
        // Generate all outputs if no specific outputs are selected
        if (options.mcp || generateAll) {
            const mcpPath = path_1.default.join(outputDir, "generated.mcp.json");
            fs_1.default.writeFileSync(mcpPath, JSON.stringify(mcp, null, 2));
            console.log(`📝 MCP JSON written to: ${mcpPath}`);
        }
        if (options.prompt || generateAll) {
            const promptPath = path_1.default.join(outputDir, "prompt.txt");
            fs_1.default.writeFileSync(promptPath, (0, toPrompt_1.exportPrompt)(mcp));
            console.log(`📝 Prompt text written to: ${promptPath}`);
        }
        if (options.templates || generateAll) {
            const templatesPath = path_1.default.join(outputDir, "templates.json");
            fs_1.default.writeFileSync(templatesPath, JSON.stringify((0, toTemplates_1.exportJsonTemplates)(mcp), null, 2));
            console.log(`📝 JSON templates written to: ${templatesPath}`);
        }
        if (options.functions || generateAll) {
            const functionsPath = path_1.default.join(outputDir, "functionSchemas.json");
            fs_1.default.writeFileSync(functionsPath, JSON.stringify((0, toFunctionSchemas_1.exportFunctionSchemas)(mcp), null, 2));
            console.log(`📝 Function schemas written to: ${functionsPath}`);
        }
        // Generate server and related components as requested
        if (options.server || generateAll) {
            (0, generateMcpServer_1.generateMcpServer)(mcp, outputDir, options.apiUrl);
        }
        if (options.executor || generateAll) {
            // Import dynamically to avoid circular dependencies
            const executorModule = await Promise.resolve().then(() => __importStar(require('./generator/exporters/generateExecutor')));
            executorModule.generateExecutor(mcp, outputDir, options.apiUrl);
            console.log(`📝 Executor generated at: ${path_1.default.join(outputDir, "executor.ts")}`);
        }
        if (options.handlers || generateAll) {
            // Import dynamically to avoid circular dependencies
            const handlersModule = await Promise.resolve().then(() => __importStar(require('./generator/exporters/generateHandlers')));
            handlersModule.generateHandlers(mcp, outputDir, options.apiUrl);
            console.log(`📝 Handler files generated in: ${path_1.default.join(outputDir, "handlers/")}`);
        }
        // Generate LangChain tools if requested
        if (options.langchain || generateAll) {
            (0, toLangChainTools_1.generateLangChainTools)(mcp, outputDir, options.apiUrl);
        }
        // Generate OpenAI plugin if requested
        if (options["openai-plugin"] || generateAll) {
            (0, toOpenAIPlugin_1.generateOpenAIPlugin)(mcp, outputDir, options.apiUrl);
        }
        console.log("\n✨ MCP generation complete! ✨");
    }
    catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
});
program.parse();
//# sourceMappingURL=index.js.map