#!/usr/bin/env node
import { parseSwagger } from "./parser";
import { extractActions } from "./generator/extractor";
import { buildMCPJson } from "./generator/mcpBuilder";
import { exportPrompt } from "./generator/exporters/toPrompt";
import { exportFunctionSchemas } from "./generator/exporters/toFunctionSchemas";
import { exportJsonTemplates } from "./generator/exporters/toTemplates";
import { generateMcpServer } from "./generator/exporters/generateMcpServer";
import { simulateMcp } from "./generator/exporters/simulate";
import { generateLangChainTools } from "./generator/exporters/toLangChainTools";
import { generateOpenAIPlugin } from "./generator/exporters/toOpenAIPlugin";
import { Command } from "commander";
import fs from "fs";
import path from "path";

const program = new Command();

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
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      
      console.log(`📥 Parsing Swagger file: ${swaggerFile}`);
      const api = await parseSwagger(swaggerFile);
      
      console.log("🔍 Extracting actions from API spec");
      const actions = extractActions(api);
      console.log(`✅ Found ${actions.length} API actions`);
      
      console.log("🔧 Building MCP JSON structure");
      const mcp = buildMCPJson(api, actions, { 
        sourceFile: path.basename(swaggerFile) 
      }, options.stateEndpoint);

      if (mcp.stateSchema) {
        console.log(`🔍 Found state schema from ${mcp.stateSchema.description}`);
      }
      
      // Handle simulation if requested
      if (options.simulate) {
        // Import handlers here dynamically to avoid using them in regular runs
        try {
          const handlersModule = await import('./generator/exporters/generateHandlers');
          const executorModule = await import('./generator/exporters/generateExecutor');
          
          // Generate handlers and executor
          console.log(`📂 Generating temporary handlers for simulation`);
          handlersModule.generateHandlers(mcp, outputDir, options.apiUrl);
          executorModule.generateExecutor(mcp, outputDir, options.apiUrl);
          
          // Run simulation
          await simulateMcp(mcp, options.simulate, options.apiUrl, {
            provider: options.provider
          });
          
          // Exit early as we're just simulating
          return;
        } catch (error: any) {
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
        const mcpPath = path.join(outputDir, "generated.mcp.json");
        fs.writeFileSync(mcpPath, JSON.stringify(mcp, null, 2));
        console.log(`📝 MCP JSON written to: ${mcpPath}`);
      }
      
      if (options.prompt || generateAll) {
        const promptPath = path.join(outputDir, "prompt.txt");
        fs.writeFileSync(promptPath, exportPrompt(mcp));
        console.log(`📝 Prompt text written to: ${promptPath}`);
      }
      
      if (options.templates || generateAll) {
        const templatesPath = path.join(outputDir, "templates.json");
        fs.writeFileSync(templatesPath, JSON.stringify(exportJsonTemplates(mcp), null, 2));
        console.log(`📝 JSON templates written to: ${templatesPath}`);
      }
      
      if (options.functions || generateAll) {
        const functionsPath = path.join(outputDir, "functionSchemas.json");
        fs.writeFileSync(functionsPath, JSON.stringify(exportFunctionSchemas(mcp), null, 2));
        console.log(`📝 Function schemas written to: ${functionsPath}`);
      }
      
      // Generate server and related components as requested
      if (options.server || generateAll) {
        generateMcpServer(mcp, outputDir, options.apiUrl);
      }

      if (options.executor || generateAll) {
        // Import dynamically to avoid circular dependencies
        const executorModule = await import('./generator/exporters/generateExecutor');
        executorModule.generateExecutor(mcp, outputDir, options.apiUrl);
        console.log(`📝 Executor generated at: ${path.join(outputDir, "executor.ts")}`);
      }

      if (options.handlers || generateAll) {
        // Import dynamically to avoid circular dependencies
        const handlersModule = await import('./generator/exporters/generateHandlers');
        handlersModule.generateHandlers(mcp, outputDir, options.apiUrl);
        console.log(`📝 Handler files generated in: ${path.join(outputDir, "handlers/")}`);
      }
      
      // Generate LangChain tools if requested
      if (options.langchain || generateAll) {
        generateLangChainTools(mcp, outputDir, options.apiUrl);
      }
      
      // Generate OpenAI plugin if requested
      if (options["openai-plugin"] || generateAll) {
        generateOpenAIPlugin(mcp, outputDir, options.apiUrl);
      }
      
      console.log("\n✨ MCP generation complete! ✨");
    } catch (error: any) {
      console.error(`❌ Error: ${error.message}`);
      process.exit(1);
    }
  });

program.parse(); 