/**
 * API Executor for Generated MCP
 * Generated from Auto-generated Model Control Protocol from OpenAPI
 * Version: 1.0.0
 */
export declare class ApiExecutor {
    private baseUrl;
    constructor(baseUrl?: string);
    /**
     * Execute an API action with the given name and parameters
     */
    execute(actionName: string, params?: any): Promise<any>;
    /**
     * Get the current state of the API/system
     */
    getState(): Promise<any>;
    /**
     * Get handler for a specific action
     */
    private getHandler;
}
