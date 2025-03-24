"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractActions = extractActions;
exports.extractGroups = extractGroups;
function extractActions(api) {
    var _a, _b, _c, _d, _e, _f;
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
                example: ((_a = op.examples) === null || _a === void 0 ? void 0 : _a["application/json"]) ? {
                    description: op.summary || op.description || `${method.toUpperCase()} ${path}`,
                    response: op.examples["application/json"].value
                } : undefined
            };
            if (op.parameters) {
                for (const param of op.parameters) {
                    action.params[param.name] = ((_b = param.schema) === null || _b === void 0 ? void 0 : _b.type) || "string";
                }
            }
            // Body params
            if ((_f = (_e = (_d = (_c = op.requestBody) === null || _c === void 0 ? void 0 : _c.content) === null || _d === void 0 ? void 0 : _d["application/json"]) === null || _e === void 0 ? void 0 : _e.schema) === null || _f === void 0 ? void 0 : _f.properties) {
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