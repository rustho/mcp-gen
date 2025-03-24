"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractStateSchema = extractStateSchema;
function extractStateSchema(api, stateEndpoint) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
    // If a specific endpoint is provided, try to use it first
    if (stateEndpoint) {
        // Normalize the path to ensure it starts with /
        const normalizedEndpoint = stateEndpoint.startsWith('/') ? stateEndpoint : `/${stateEndpoint}`;
        // Check if the endpoint exists and has a GET method
        if (api.paths[normalizedEndpoint] && api.paths[normalizedEndpoint].get) {
            const getOp = api.paths[normalizedEndpoint].get;
            const responseSchema = (_d = (_c = (_b = (_a = getOp === null || getOp === void 0 ? void 0 : getOp.responses) === null || _a === void 0 ? void 0 : _a["200"]) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c["application/json"]) === null || _d === void 0 ? void 0 : _d.schema;
            const example = (_h = (_g = (_f = (_e = getOp === null || getOp === void 0 ? void 0 : getOp.responses) === null || _e === void 0 ? void 0 : _e["200"]) === null || _f === void 0 ? void 0 : _f.content) === null || _g === void 0 ? void 0 : _g["application/json"]) === null || _h === void 0 ? void 0 : _h.example;
            if (responseSchema) {
                return {
                    path: normalizedEndpoint,
                    description: getOp.summary || getOp.description || `State from GET ${normalizedEndpoint}`,
                    schema: responseSchema,
                    example: example || generateExampleFromSchema(responseSchema)
                };
            }
            else {
                console.warn(`Warning: The specified endpoint ${normalizedEndpoint} does not have a JSON schema response. Falling back to auto-detection.`);
            }
        }
        else {
            console.warn(`Warning: The specified endpoint ${normalizedEndpoint} does not exist or does not have a GET method. Falling back to auto-detection.`);
        }
    }
    // Find candidates: GET requests without path parameters
    const candidates = Object.entries(api.paths)
        .filter(([path, pathObj]) => pathObj.get && // Has GET method
        !path.includes("{") // No path parameters like /users/{id}
    );
    // Priority paths that likely represent state
    const priorityKeywords = ['state', 'status', 'scene', 'objects', 'tracks', 'world'];
    // Sort candidates by priority
    const sortedCandidates = [...candidates].sort(([pathA], [pathB]) => {
        const pathALower = pathA.toLowerCase();
        const pathBLower = pathB.toLowerCase();
        // Check if path contains priority keywords
        const aKeywordIndex = priorityKeywords.findIndex(keyword => pathALower.includes(keyword));
        const bKeywordIndex = priorityKeywords.findIndex(keyword => pathBLower.includes(keyword));
        // Both have keywords - sort by keyword priority
        if (aKeywordIndex >= 0 && bKeywordIndex >= 0) {
            return aKeywordIndex - bKeywordIndex;
        }
        // Only one has a keyword
        if (aKeywordIndex >= 0)
            return -1;
        if (bKeywordIndex >= 0)
            return 1;
        // Neither has a keyword - shorter paths first
        return pathA.length - pathB.length;
    });
    // Try to find a suitable state endpoint
    for (const [path, pathObj] of sortedCandidates) {
        const getOp = pathObj.get;
        const responseSchema = (_m = (_l = (_k = (_j = getOp === null || getOp === void 0 ? void 0 : getOp.responses) === null || _j === void 0 ? void 0 : _j["200"]) === null || _k === void 0 ? void 0 : _k.content) === null || _l === void 0 ? void 0 : _l["application/json"]) === null || _m === void 0 ? void 0 : _m.schema;
        const example = (_r = (_q = (_p = (_o = getOp === null || getOp === void 0 ? void 0 : getOp.responses) === null || _o === void 0 ? void 0 : _o["200"]) === null || _p === void 0 ? void 0 : _p.content) === null || _q === void 0 ? void 0 : _q["application/json"]) === null || _r === void 0 ? void 0 : _r.example;
        if (responseSchema) {
            return {
                path,
                description: getOp.summary || getOp.description || `State from GET ${path}`,
                schema: responseSchema,
                example: example || generateExampleFromSchema(responseSchema)
            };
        }
    }
    return null;
}
// Helper function to generate a simple example from schema
function generateExampleFromSchema(schema) {
    var _a;
    if (!schema)
        return null;
    if (schema.example)
        return schema.example;
    if (schema.type === 'object' && schema.properties) {
        const result = {};
        for (const [key, prop] of Object.entries(schema.properties)) {
            result[key] = generateExampleFromSchema(prop);
        }
        return result;
    }
    if (schema.type === 'array' && schema.items) {
        const exampleItem = generateExampleFromSchema(schema.items);
        return exampleItem ? [exampleItem] : [];
    }
    // Default values for primitive types
    switch (schema.type) {
        case 'string': return ((_a = schema.enum) === null || _a === void 0 ? void 0 : _a[0]) || "example";
        case 'number': return 0;
        case 'integer': return 0;
        case 'boolean': return false;
        default: return null;
    }
}
//# sourceMappingURL=extractState.js.map