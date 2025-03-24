"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractStateSchema = extractStateSchema;
function extractStateSchema(api, stateEndpoint) {
    // If a specific endpoint is provided, try to use it first
    if (stateEndpoint) {
        // Normalize the path to ensure it starts with /
        const normalizedEndpoint = stateEndpoint.startsWith('/') ? stateEndpoint : `/${stateEndpoint}`;
        // Check if the endpoint exists and has a GET method
        if (api.paths[normalizedEndpoint] && api.paths[normalizedEndpoint].get) {
            const getOp = api.paths[normalizedEndpoint].get;
            const responseSchema = getOp?.responses?.["200"]?.content?.["application/json"]?.schema;
            const example = getOp?.responses?.["200"]?.content?.["application/json"]?.example;
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
        const responseSchema = getOp?.responses?.["200"]?.content?.["application/json"]?.schema;
        const example = getOp?.responses?.["200"]?.content?.["application/json"]?.example;
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
        case 'string': return schema.enum?.[0] || "example";
        case 'number': return 0;
        case 'integer': return 0;
        case 'boolean': return false;
        default: return null;
    }
}
//# sourceMappingURL=extractState.js.map