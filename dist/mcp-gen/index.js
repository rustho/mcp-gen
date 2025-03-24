#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const commander_1 = require("commander");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const program = new commander_1.Command();
program
    .name("mcp-gen")
    .description("Generate MCP files from OpenAPI/Swagger specifications")
    .version("1.0.0");
program
    .argument("<swagger-file>", "Path to OpenAPI/Swagger file")
    .option("-o, --output <dir>", "Output directory", "./out")
    .option("--prompt", "Generate prompt instruction text")
    .option("--functions", "Generate OpenAI function schemas")
    .option("--templates", "Generate JSON action templates")
    .option("--mcp", "Generate MCP JSON file")
    .option("--all", "Generate all export formats")
    .option("--state-endpoint <path>", "Specify a specific GET endpoint to use for state schema (e.g. /status)")
    .action((swaggerFile, options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const outputDir = options.output;
        // Create output directory if it doesn't exist
        if (!fs_1.default.existsSync(outputDir)) {
            fs_1.default.mkdirSync(outputDir, { recursive: true });
        }
        console.log(`📥 Parsing Swagger file: ${swaggerFile}`);
        const api = yield (0, parser_1.parseSwagger)(swaggerFile);
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
        const generateAll = options.all ||
            !(options.prompt || options.functions || options.templates || options.mcp);
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
        console.log("\n✨ MCP generation complete! ✨");
    }
    catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
}));
program.parse();
//# sourceMappingURL=index.js.map