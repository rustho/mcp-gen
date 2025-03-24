"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Home;
// @ts-nocheck
const react_1 = require("react");
const head_1 = __importDefault(require("next/head"));
function Home() {
    const [input, setInput] = (0, react_1.useState)("");
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [output, setOutput] = (0, react_1.useState)("");
    const [currentTab, setCurrentTab] = (0, react_1.useState)("prompt"); // 'prompt', 'execute', 'mcp', 'prompt-execute'
    const [apiKey, setApiKey] = (0, react_1.useState)("");
    const [isDemoMode, setIsDemoMode] = (0, react_1.useState)(true);
    const [showApiKeyInput, setShowApiKeyInput] = (0, react_1.useState)(false);
    async function handleSubmit(e) {
        e.preventDefault();
        if (!input.trim())
            return;
        setLoading(true);
        try {
            if (currentTab === "prompt-execute") {
                // First call the prompt API
                const promptResponse = await fetch("/api/prompt", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        text: input,
                        isDemoMode,
                        apiKey: isDemoMode ? undefined : apiKey,
                    }),
                });
                if (!promptResponse.ok) {
                    throw new Error(`HTTP error! status: ${promptResponse.status}`);
                }
                const promptData = await promptResponse.json();
                // Then call the execute API with the result
                const executeResponse = await fetch("/api/execute", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        text: JSON.stringify(promptData),
                        isDemoMode,
                        apiKey: isDemoMode ? undefined : apiKey,
                    }),
                });
                if (!executeResponse.ok) {
                    throw new Error(`HTTP error! status: ${executeResponse.status}`);
                }
                const executeData = await executeResponse.json();
                setOutput(JSON.stringify(executeData, null, 2));
            }
            else {
                // Regular flow for other tabs
                const response = await fetch(`/api/${currentTab}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        text: input,
                        isDemoMode,
                        apiKey: isDemoMode ? undefined : apiKey,
                    }),
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setOutput(JSON.stringify(data, null, 2));
            }
        }
        catch (error) {
            console.error("Error:", error);
            setOutput(`Error: ${error instanceof Error ? error.message : String(error)}`);
        }
        finally {
            setLoading(false);
        }
    }
    const handleModeChange = (mode) => {
        if (mode === "demo") {
            setIsDemoMode(true);
            setShowApiKeyInput(false);
            setApiKey("");
        }
        else {
            setIsDemoMode(false);
            setShowApiKeyInput(true);
        }
    };
    return (<div className="min-h-screen bg-gray-100 p-4">
      <head_1.default>
        <title>MCP Swagger Playground</title>
        <meta name="description" content="Test MCP commands with OpenAPI"/>
        <link rel="icon" href="/favicon.ico"/>
      </head_1.default>

      <main className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          MCP Swagger Playground
        </h1>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Container - Controls */}
          <div className="md:w-1/2">
            {/* Mode Selection */}
            <div className="mb-6 p-4 bg-white rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Select Mode:</h2>
              <div className="flex space-x-4">
                <button onClick={() => handleModeChange("demo")} className={`px-4 py-2 rounded-md ${isDemoMode
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}>
                  Demo Mode
                </button>
                <button onClick={() => handleModeChange("api")} className={`px-4 py-2 rounded-md ${!isDemoMode
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}>
                  API Mode
                </button>
              </div>

              {/* API Key Input */}
              {showApiKeyInput && (<div className="mt-4">
                  <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
                    API Key:
                  </label>
                  <input type="password" id="apiKey" value={apiKey} onChange={(e) => setApiKey(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md shadow-sm" placeholder="Enter your API key"/>
                </div>)}
            </div>

            {/* Tabs */}
            <div className="mb-4 flex border-b">
              <button className={`px-4 py-2 ${currentTab === "prompt"
            ? "border-b-2 border-blue-500 text-blue-600"
            : "text-gray-600"}`} onClick={() => setCurrentTab("prompt")}>
                Prompt
              </button>
              <button className={`px-4 py-2 ${currentTab === "execute"
            ? "border-b-2 border-blue-500 text-blue-600"
            : "text-gray-600"}`} onClick={() => setCurrentTab("execute")}>
                Execute
              </button>
              <button className={`px-4 py-2 ${currentTab === "mcp"
            ? "border-b-2 border-blue-500 text-blue-600"
            : "text-gray-600"}`} onClick={() => setCurrentTab("mcp")}>
                MCP
              </button>
              <button className={`px-4 py-2 ${currentTab === "prompt-execute"
            ? "border-b-2 border-blue-500 text-blue-600"
            : "text-gray-600"}`} onClick={() => setCurrentTab("prompt-execute")}>
                Prompt → Execute
              </button>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="input" className="block text-sm font-medium text-gray-700 mb-1">
                  {currentTab === "prompt" || currentTab === "prompt-execute"
            ? "Your text:"
            : currentTab === "execute"
                ? "MCP JSON:"
                : "Action & params:"}
                </label>
                <textarea id="input" value={input} onChange={(e) => setInput(e.target.value)} className="w-full h-64 p-2 border border-gray-300 rounded-md shadow-sm" placeholder={currentTab === "prompt"
            ? "Enter your text here..."
            : currentTab === "prompt-execute"
                ? "Enter your text here to convert to MCP and execute..."
                : currentTab === "execute"
                    ? "Enter MCP JSON command..."
                    : "Enter action and params as JSON..."}/>
              </div>

              <button type="submit" disabled={loading || (!isDemoMode && !apiKey)} className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md shadow-sm disabled:bg-blue-300">
                {loading ? "Processing..." : "Submit"}
              </button>
            </form>
          </div>

          {/* Right Container - Results */}
          <div className="md:w-1/2 bg-white rounded-lg shadow p-4">
            <h2 className="text-xl font-semibold mb-4">Result:</h2>
            <pre className="bg-gray-800 text-green-400 p-4 rounded-md overflow-auto h-[calc(100vh-16rem)]">
              {output || "Results will appear here"}
            </pre>
          </div>
        </div>
      </main>
    </div>);
}
//# sourceMappingURL=index.js.map