"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractActions = extractActions;
exports.extractGroups = extractGroups;
function extractActions(api) {
    const actions = [];
    for (const path in api.paths) {
        const pathObj = api.paths[path];
        for (const method in pathObj) {
            const op = pathObj[method];
            const action = {
                action: op.operationId || `${method}_${path.replace(/\//g, "_")}`,
                method: method.toUpperCase(),
                path,
                description: op.summary || op.description || `${method.toUpperCase()} ${path}`,
                params: {},
                tags: op.tags || [],
                example: op.examples?.["application/json"] ? {
                    description: op.summary || op.description || `${method.toUpperCase()} ${path}`,
                    response: op.examples["application/json"].value
                } : undefined
            };
            if (op.parameters) {
                for (const param of op.parameters) {
                    action.params[param.name] = param.schema?.type || "string";
                }
            }
            // Body params
            if (op.requestBody?.content?.["application/json"]?.schema?.properties) {
                const props = op.requestBody.content["application/json"].schema.properties;
                for (const name in props) {
                    action.params[name] = props[name].type || "string";
                }
            }
            actions.push(action);
        }
    }
    return actions;
}
function extractGroups(api) {
    const groups = {};
    if (api.tags) {
        for (const tag of api.tags) {
            if (tag.name && tag.description) {
                groups[tag.name.toLowerCase()] = tag.description;
            }
        }
    }
    return groups;
}
//# sourceMappingURL=extractor.js.map