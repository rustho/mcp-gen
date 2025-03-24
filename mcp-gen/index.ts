#!/usr/bin/env node
import { parseSwagger } from "./parser";
import { extractActions } from "./generator/extractor";
import { buildMCPJson } from "./generator/mcpBuilder";
import { exportPrompt } from "./generator/exporters/toPrompt";
import { exportFunctionSchemas } from "./generator/exporters/toFunctionSchemas";
import { exportJsonTemplates } from "./generator/exporters/toTemplates";
import { Command } from "commander";
import fs from "fs";
import path from "path";

const program = new Command();

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
      
      const generateAll = options.all || 
        !(options.prompt || options.functions || options.templates || options.mcp);
      
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
      
      console.log("\n✨ MCP generation complete! ✨");
    } catch (error: any) {
      console.error(`❌ Error: ${error.message}`);
      process.exit(1);
    }
  });

program.parse(); 