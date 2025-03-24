"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportJsonTemplates = exportJsonTemplates;
function exportJsonTemplates(mcp) {
    const templates = mcp.actions.map(action => ({
        action: action.action,
        params: Object.fromEntries(Object.entries(action.params).map(([key, type]) => [key, type]))
    }));
    // Add getState template if state schema is available
    if (mcp.stateSchema) {
        templates.push({
            action: "getState",
            params: {}
        });
    }
    return templates;
}
//# sourceMappingURL=toTemplates.js.map