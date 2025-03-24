"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractActions = extractActions;
function extractActions(api) {
    var _a, _b, _c, _d, _e;
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
            };
            if (op.parameters) {
                for (const param of op.parameters) {
                    action.params[param.name] = ((_a = param.schema) === null || _a === void 0 ? void 0 : _a.type) || "string";
                }
            }
            // Body params
            if ((_e = (_d = (_c = (_b = op.requestBody) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c["application/json"]) === null || _d === void 0 ? void 0 : _d.schema) === null || _e === void 0 ? void 0 : _e.properties) {
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
//# sourceMappingURL=extractor.js.map