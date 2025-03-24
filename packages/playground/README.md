# OpenAPI-to-MCP Playground

A web application for testing the OpenAPI-to-MCP tool in your browser.

## Features

- 📤 Upload OpenAPI/Swagger files
- 🔄 Convert to MCP format
- 📥 Download generated files
- 🎨 Modern UI with Tailwind CSS
- ⚡ Fast and responsive

## Development

### Prerequisites

- Node.js 18 or later
- npm 9 or later

### Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

### Project Structure

```
playground/
├── src/
│   ├── app/              # Next.js app directory
│   │   ├── page.tsx      # Main page component
│   │   ├── layout.tsx    # Root layout
│   │   └── globals.css   # Global styles
│   └── components/       # React components
├── public/              # Static assets
└── package.json        # Dependencies and scripts
```

## Contributing

Please read the main [CONTRIBUTING.md](../CONTRIBUTING.md) file for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the ISC License - see the main [LICENSE](../LICENSE) file for details. 