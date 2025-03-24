# OpenAI Plugin for Generated MCP

This directory contains an OpenAI plugin manifest for the Generated MCP API.

## Deployment Instructions

To deploy this as an OpenAI plugin, follow these steps:

1. **Host your API**
   
   Make sure your API is publicly accessible at https://api.example.com

2. **Copy plugin files to your server**
   
   - Copy the `.well-known/ai-plugin.json` file to your server
   - Ensure your OpenAPI specification is available at `/openapi.yaml` 
     (or update the URL in the ai-plugin.json file)
   - Add a `logo.png` file (ideally 512x512px) to your server root
   - Add a `legal` page with your terms of service

3. **Verify your plugin**
   
   - Test that `https://api.example.com/.well-known/ai-plugin.json` is accessible
   - Make sure `https://api.example.com/logo.png` is accessible
   - Check that `https://api.example.com/openapi.yaml` returns your API specification

4. **Register with OpenAI**
   
   - Go to [OpenAI's plugins page](https://platform.openai.com/docs/plugins/getting-started)
   - Submit your plugin for review
   - After approval, users can install your plugin through the ChatGPT interface

## Customization

Make sure to customize the following in `ai-plugin.json`:

- `contact_email`: Your contact email
- `legal_info_url`: URL to your terms of service
- `logo_url`: URL to your plugin logo

## Testing Locally

You can test your plugin locally by:

1. Using a tool like ngrok to expose your local server
2. Following OpenAI's documentation for running your plugin in development mode

## Support

For issues or questions regarding this plugin, please refer to the OpenAI Plugins documentation 
or contact the API provider.
