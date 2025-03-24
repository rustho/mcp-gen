# Contributing to OpenAPI-to-MCP

🎉 First off, thanks for taking the time to contribute! OpenAPI-to-MCP is open to improvements, new ideas, and fixes — so let's build something great together.

---

## 🛠️ How to Contribute

### 1. Fork the repository
Click the **Fork** button in the top-right corner of the GitHub page.

### 2. Clone your fork
```bash
git clone https://github.com/your-username/openapi-to-mcp.git
cd openapi-to-mcp
```

### 3. Install dependencies
```bash
npm install
```

### 4. Create a new branch
```bash
git checkout -b feature/your-feature-name
```

### 5. Make your changes
Keep code clean, readable, and well-commented.

### 6. Run tests / build
```bash
# Build all packages
npm run build

# Test the core package
npm test --workspace=openapi-to-mcp

# Start the playground for testing
npm run dev --workspace=openapi-to-mcp-playground
```

### 7. Commit and push
```bash
git commit -m "Add: short description of your change"
git push origin feature/your-feature-name
```

### 8. Open a Pull Request
Go to GitHub, open a PR from your branch, describe the change, and wait for review ✨

## ✅ Contribution Guidelines

- Write clear and concise code
- Keep pull requests small and focused
- Document your code when needed
- Follow the TypeScript style already used
- If you add a new feature — add an example if possible
- Be kind and respectful in discussions

## 📦 Project Structure

This is a monorepo containing two packages:

- `packages/core`: The main OpenAPI-to-MCP CLI tool and library
  - Contains the core functionality for converting OpenAPI specs to MCP format
  - Includes CLI interface and all export formats
  - Located in `packages/core/`

- `packages/playground`: A web application for testing the tool
  - Provides a browser-based interface for testing the tool
  - Built with Next.js and Tailwind CSS
  - Located in `packages/playground/`

## 💬 Need help?

Feel free to open an issue or start a discussion — we're happy to support you!

Thanks for being part of the OpenAPI-to-MCP community 🚀 