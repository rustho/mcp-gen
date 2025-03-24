"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportPrompt = exportPrompt;
function exportPrompt(mcp) {
    const { promptTemplate, actions, stateSchema } = mcp;
    const actionList = actions.map(a => `- ${a.action} (${a.method} ${a.path}): ${Object.keys(a.params).join(", ")}`).join("\n");
    const firstExample = actions[0];
    let exampleParams = "";
    if (firstExample) {
        exampleParams = Object.entries(firstExample.params)
            .map(([k, v]) => `"${k}": "${v}"`).join(",\n    ");
    }
    let stateInfo = "";
    if (stateSchema) {
        stateInfo = `\n\nSystem State Information:
The system maintains a state that can be queried. The state structure is:
${formatStateSchema(stateSchema)}

Example state:
${JSON.stringify(stateSchema.example, null, 2)}`;
    }
    return `${promptTemplate.prefix}

${actionList}${stateInfo}

You should return commands in JSON format, for example:
${firstExample ? `{
  "action": "${firstExample.action}",
  "params": {
    ${exampleParams}
  }
}` : '{"action": "example", "params": {}}'}
  `.trim();
}
function formatStateSchema(stateSchema) {
    const { type, properties, description } = stateSchema;
    if (type === 'object' && properties) {
        const propLines = Object.entries(properties)
            .map(([key, prop]) => `  - ${key}: ${prop.type || 'any'}`)
            .join('\n');
        return `${description || 'State object'} (${type}):\n${propLines}`;
    }
    else if (type === 'array') {
        return `${description || 'State array'} (${type} of items)`;
    }
    else {
        return `${description || 'State'} (${type})`;
    }
}
//# sourceMappingURL=toPrompt.js.map